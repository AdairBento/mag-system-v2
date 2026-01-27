/**
 * Base class for business errors
 */
export abstract class BusinessError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error when entity is not found
 */
export class NotFoundError extends BusinessError {
  constructor(entity: string, identifier: string) {
    super(
      `${entity} com identificador '${identifier}' não encontrado`,
      'NOT_FOUND',
      404,
    );
  }
}

/**
 * Error when entity already exists
 */
export class AlreadyExistsError extends BusinessError {
  constructor(entity: string, field: string, value: string) {
    super(
      `${entity} com ${field} '${value}' já existe`,
      'ALREADY_EXISTS',
      409,
    );
  }
}

/**
 * Error when validation fails
 */
export class ValidationError extends BusinessError {
  constructor(message: string, public readonly errors?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

/**
 * Error when business rule is violated
 */
export class BusinessRuleError extends BusinessError {
  constructor(message: string) {
    super(message, 'BUSINESS_RULE_VIOLATION', 422);
  }
}

/**
 * Error when authorization fails
 */
export class UnauthorizedError extends BusinessError {
  constructor(message: string = 'Não autorizado') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

/**
 * Error when permission is denied
 */
export class ForbiddenError extends BusinessError {
  constructor(message: string = 'Acesso negado') {
    super(message, 'FORBIDDEN', 403);
  }
}
