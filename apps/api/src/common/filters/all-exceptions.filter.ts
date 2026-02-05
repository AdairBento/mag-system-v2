import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ErrorCode,
  ErrorResponse,
  STATUS_TO_ERROR_CODE,
} from '../exceptions/error-response.interface';

interface HttpExceptionResponse {
  message?: string | string[];
  errors?: Record<string, unknown>;
  statusCode?: number;
}

/**
 * Filtro global de exceções (fallback)
 * Captura todas as exceções não tratadas por filtros específicos
 *
 * Ordem de prioridade:
 * 1. PrismaExceptionFilter (erros Prisma)
 * 2. AllExceptionsFilter (todos os outros)
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const requestId = request['requestId'] || 'unknown';
    const path = request.url;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ErrorCode.INTERNAL_ERROR;
    let message: string | string[] = 'Erro interno do servidor';
    let details: Record<string, unknown> | undefined;

    // HttpException (erros HTTP do NestJS)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = STATUS_TO_ERROR_CODE[status] || ErrorCode.INTERNAL_ERROR;

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const httpResponse = exceptionResponse as HttpExceptionResponse;
        message = httpResponse.message || message;
        details = httpResponse.errors;

        // Tratar validações do class-validator
        if (Array.isArray(message) && status === HttpStatus.BAD_REQUEST) {
          code = ErrorCode.VALIDATION_ERROR;
          details = { validationErrors: message };
          message = 'Erro de validação nos dados fornecidos';
        }
      } else {
        message = exceptionResponse as string;
      }
    }
    // Error genérico (JavaScript/TypeScript)
    else if (exception instanceof Error) {
      message = exception.message;
      details = {
        stack:
          process.env.NODE_ENV === 'development'
            ? exception.stack
            : undefined,
      };
    }
    // Unknown exception
    else {
      message = 'Erro desconhecido';
      this.logger.error('Unknown exception type:', exception);
    }

    // Logar erro com contexto
    if (status >= 500) {
      this.logger.error(
        `[${requestId}] ${status} on ${path}:`,
        JSON.stringify({
          code,
          message,
          details,
          exception: exception instanceof Error ? exception.message : exception,
        }),
      );
    } else {
      this.logger.warn(
        `[${requestId}] ${status} on ${path}: ${JSON.stringify(message)}`,
      );
    }

    // Montar resposta padronizada
    const errorResponse: ErrorResponse = {
      error: {
        code,
        message: Array.isArray(message) ? message[0] : message,
        details,
        requestId,
        timestamp: new Date().toISOString(),
        path,
      },
    };

    response.status(status).json(errorResponse);
  }
}
