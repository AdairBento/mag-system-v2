export declare abstract class BusinessError extends Error {
    readonly code: string;
    readonly statusCode: number;
    constructor(message: string, code: string, statusCode?: number);
}
export declare class NotFoundError extends BusinessError {
    constructor(entity: string, identifier: string);
}
export declare class AlreadyExistsError extends BusinessError {
    constructor(entity: string, field: string, value: string);
}
export declare class ValidationError extends BusinessError {
    readonly errors?: Record<string, string[]> | undefined;
    constructor(message: string, errors?: Record<string, string[]> | undefined);
}
export declare class BusinessRuleError extends BusinessError {
    constructor(message: string);
}
export declare class UnauthorizedError extends BusinessError {
    constructor(message?: string);
}
export declare class ForbiddenError extends BusinessError {
    constructor(message?: string);
}
//# sourceMappingURL=index.d.ts.map