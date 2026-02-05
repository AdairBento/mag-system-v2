import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { randomUUID } from 'crypto';

/**
 * Interceptor global de logging
 *
 * Funcionalidades:
 * 1. Gera requestId único para rastreamento
 * 2. Loga início e fim de cada request
 * 3. Captura tempo de execução
 * 4. Extrai contexto do usuário quando autenticado
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, headers } = request;

    // Gerar requestId (ou usar existente do header)
    const requestId =
      (headers['x-request-id'] as string) || randomUUID();

    // Adicionar requestId ao objeto request (disponível em filters/guards)
    request['requestId'] = requestId;

    // Extrair contexto do usuário autenticado (se existir)
    const user = request['user'];
    const userId = user?.id || 'anonymous';

    const now = Date.now();

    // Log de início da request
    this.logger.log(
      `[${requestId}] ${method} ${url} - User: ${userId} - START`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - now;
          this.logger.log(
            `[${requestId}] ${method} ${url} - ${duration}ms - SUCCESS`,
          );
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.error(
            `[${requestId}] ${method} ${url} - ${duration}ms - ERROR: ${error.message}`,
          );
        },
      }),
    );
  }
}

/**
 * Middleware alternativo (se preferir usar como middleware ao invés de interceptor)
 *
 * Usage no main.ts:
 * app.use(requestIdMiddleware);
 */
export function requestIdMiddleware(
  req: Request,
  res: any,
  next: () => void,
) {
  const requestId =
    (req.headers['x-request-id'] as string) || randomUUID();
  req['requestId'] = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}
