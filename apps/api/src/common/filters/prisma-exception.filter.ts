import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@mag-system/database';
import { Response } from 'express';
import { ErrorCode, ErrorResponse } from '../exceptions/error-response.interface';

/**
 * Filtro especializado para tratar erros do Prisma ORM
 * Mapeia códigos P20xx para respostas HTTP semantícas
 *
 * Referência: https://www.prisma.io/docs/reference/api-reference/error-reference
 */
@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientValidationError,
)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const requestId = request['requestId'] || 'unknown';
    const path = request.url;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ErrorCode.DATABASE_ERROR;
    let message = 'Database error';
    let details: Record<string, unknown> | undefined;

    // PrismaClientKnownRequestError (códigos P20xx)
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = exception as Prisma.PrismaClientKnownRequestError;

      switch (prismaError.code) {
        // P2002: Unique constraint violation
        case 'P2002': {
          status = HttpStatus.CONFLICT;
          code = ErrorCode.DUPLICATE_ENTRY;
          const fields = (prismaError.meta?.target as string[]) || [];
          message = `Já existe um registro com ${fields.join(', ')} duplicado(s)`;
          details = {
            fields,
            constraint: 'unique',
          };
          break;
        }

        // P2025: Record not found
        case 'P2025': {
          status = HttpStatus.NOT_FOUND;
          code = ErrorCode.RESOURCE_NOT_FOUND;
          message = 'Registro não encontrado';
          details = {
            cause: prismaError.meta?.cause,
          };
          break;
        }

        // P2003: Foreign key constraint violation
        case 'P2003': {
          status = HttpStatus.BAD_REQUEST;
          code = ErrorCode.VALIDATION_ERROR;
          const field = prismaError.meta?.field_name as string;
          message = `Referência inválida no campo ${field}`;
          details = {
            field,
            constraint: 'foreign_key',
          };
          break;
        }

        // P2014: Required relation violation
        case 'P2014': {
          status = HttpStatus.CONFLICT;
          code = ErrorCode.RESOURCE_IN_USE;
          message = 'Não é possível excluir registro porque está em uso';
          details = {
            relation: prismaError.meta?.relation_name,
          };
          break;
        }

        // P2021: Table doesn't exist
        case 'P2021': {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          code = ErrorCode.DATABASE_ERROR;
          message = 'Erro de configuração do banco de dados';
          this.logger.error(`Table not found: ${prismaError.meta?.table}`);
          break;
        }

        // P2022: Column doesn't exist
        case 'P2022': {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          code = ErrorCode.DATABASE_ERROR;
          message = 'Erro de estrutura do banco de dados';
          this.logger.error(`Column not found: ${prismaError.meta?.column}`);
          break;
        }

        // Outros erros conhecidos
        default: {
          this.logger.error(
            `Unhandled Prisma error code: ${prismaError.code}`,
            prismaError.message,
          );
          message = 'Erro ao processar operação no banco de dados';
          details = {
            code: prismaError.code,
          };
        }
      }
    }
    // PrismaClientValidationError (erro de validação de query)
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      code = ErrorCode.VALIDATION_ERROR;
      message = 'Dados inválidos fornecidos';
      this.logger.error('Prisma validation error', exception.message);
    }
    // PrismaClientUnknownRequestError (erro desconhecido)
    else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      this.logger.error('Unknown Prisma error', exception.message);
    }

    // Logar erro com contexto
    this.logger.error(
      `[${requestId}] Prisma error on ${path}:`,
      JSON.stringify({
        code,
        message,
        details,
        exception: exception instanceof Error ? exception.message : exception,
      }),
    );

    // Montar resposta padronizada
    const errorResponse: ErrorResponse = {
      error: {
        code,
        message,
        details,
        requestId,
        timestamp: new Date().toISOString(),
        path,
      },
    };

    response.status(status).json(errorResponse);
  }
}
