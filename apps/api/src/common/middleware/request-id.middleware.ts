import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Middleware que adiciona um ID único a cada requisição
 * para rastreamento e correlação de logs
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Usar requestId do cliente se fornecido, senão gerar novo
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();

    // Adicionar ao request para uso em filters/interceptors
    req['requestId'] = requestId;

    // Retornar no response header
    res.setHeader('X-Request-Id', requestId);

    next();
  }
}
