"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.UnauthorizedError = exports.BusinessRuleError = exports.ValidationError = exports.AlreadyExistsError = exports.NotFoundError = exports.BusinessError = void 0;
class BusinessError extends Error {
    constructor(message, code, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BusinessError = BusinessError;
class NotFoundError extends BusinessError {
    constructor(entity, identifier) {
        super(`${entity} com identificador '${identifier}' não encontrado`, 'NOT_FOUND', 404);
    }
}
exports.NotFoundError = NotFoundError;
class AlreadyExistsError extends BusinessError {
    constructor(entity, field, value) {
        super(`${entity} com ${field} '${value}' já existe`, 'ALREADY_EXISTS', 409);
    }
}
exports.AlreadyExistsError = AlreadyExistsError;
class ValidationError extends BusinessError {
    constructor(message, errors) {
        super(message, 'VALIDATION_ERROR', 400);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
class BusinessRuleError extends BusinessError {
    constructor(message) {
        super(message, 'BUSINESS_RULE_VIOLATION', 422);
    }
}
exports.BusinessRuleError = BusinessRuleError;
class UnauthorizedError extends BusinessError {
    constructor(message = 'Não autorizado') {
        super(message, 'UNAUTHORIZED', 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends BusinessError {
    constructor(message = 'Acesso negado') {
        super(message, 'FORBIDDEN', 403);
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=index.js.map