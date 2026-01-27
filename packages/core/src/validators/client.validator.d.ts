import { z } from 'zod';
export declare const createClientSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    document: z.ZodEffects<z.ZodString, string, string>;
    documentType: z.ZodEnum<["CPF", "CNPJ"]>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    zipCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    document: string;
    phone: string;
    documentType: "CPF" | "CNPJ";
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zipCode?: string | undefined;
}, {
    name: string;
    email: string;
    document: string;
    phone: string;
    documentType: "CPF" | "CNPJ";
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zipCode?: string | undefined;
}>;
export declare const updateClientSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    document: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    documentType: z.ZodOptional<z.ZodEnum<["CPF", "CNPJ"]>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    state: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    zipCode: z.ZodOptional<z.ZodOptional<z.ZodString>>;
} & {
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE", "BLOCKED"]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    document?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "BLOCKED" | undefined;
    phone?: string | undefined;
    documentType?: "CPF" | "CNPJ" | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zipCode?: string | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    document?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "BLOCKED" | undefined;
    phone?: string | undefined;
    documentType?: "CPF" | "CNPJ" | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zipCode?: string | undefined;
}>;
export declare const filterClientSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    document: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE", "BLOCKED"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    name?: string | undefined;
    email?: string | undefined;
    document?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "BLOCKED" | undefined;
}, {
    name?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    email?: string | undefined;
    document?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "BLOCKED" | undefined;
}>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type FilterClientInput = z.infer<typeof filterClientSchema>;
//# sourceMappingURL=client.validator.d.ts.map