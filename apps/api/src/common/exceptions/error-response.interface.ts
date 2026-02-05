/**
 * Contrato padrão de resposta de erro da API
 * Garante previsibilidade para o frontend e facilita debugging
 */
export interface ErrorResponse {
  error: {
    /**
     * Código de erro padronizado (facilita tratamento no front)
     */
    code: ErrorCode;

    /**
     * Mensagem legível para humanos
     */
    message: string;

    /**
     * Detalhes adicionais (validação, campos, etc)
     */
    details?: Record<string, unknown>;

    /**
     * ID único da request (para rastreamento em logs)
     */
    requestId: string;

    /**
     * Timestamp ISO 8601
     */
    timestamp: string;

    /**
     * Path da request que gerou o erro
     */
    path?: string;
  };
}

/**
 * Códigos de erro padronizados
 * Facilita switch/case no frontend
 */
export enum ErrorCode {
  // 400 Bad Request
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_FORMAT = 'INVALID_FORMAT',
  MISSING_FIELD = 'MISSING_FIELD',

  // 401 Unauthorized
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // 403 Forbidden
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // 404 Not Found
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

  // 409 Conflict
  CONFLICT = 'CONFLICT',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  RESOURCE_IN_USE = 'RESOURCE_IN_USE',

  // 422 Unprocessable Entity
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  INVALID_STATE = 'INVALID_STATE',

  // 500 Internal Server Error
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

/**
 * Mapeamento de HttpStatus -> ErrorCode padrão
 */
export const STATUS_TO_ERROR_CODE: Record<number, ErrorCode> = {
  400: ErrorCode.VALIDATION_ERROR,
  401: ErrorCode.UNAUTHORIZED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
  409: ErrorCode.CONFLICT,
  422: ErrorCode.BUSINESS_RULE_VIOLATION,
  500: ErrorCode.INTERNAL_ERROR,
};
