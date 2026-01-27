"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .regex(/[A-Z]/, 'Senha deve conter letra maiúscula')
        .regex(/[a-z]/, 'Senha deve conter letra minúscula')
        .regex(/[0-9]/, 'Senha deve conter número'),
    name: zod_1.z.string().min(3).max(100),
    role: zod_1.z.enum(['ADMIN', 'MANAGER', 'OPERATOR']).default('OPERATOR'),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string()
        .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
        .regex(/[A-Z]/, 'Nova senha deve conter letra maiúscula')
        .regex(/[a-z]/, 'Nova senha deve conter letra minúscula')
        .regex(/[0-9]/, 'Nova senha deve conter número'),
    confirmPassword: zod_1.z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, { message: 'Senhas não conferem', path: ['confirmPassword'] });
//# sourceMappingURL=auth.validator.js.map