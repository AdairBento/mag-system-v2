import { z } from 'zod';
export declare const createDriverSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    document: z.ZodEffects<z.ZodString, string, string>;
    licenseNumber: z.ZodString;
    licenseCategory: z.ZodEnum<["A", "B", "AB", "C", "D", "E"]>;
    licenseExpiresAt: z.ZodEffects<z.ZodDate, Date, Date>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    zipCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    document: string;
    phone: string;
    licenseNumber: string;
    licenseCategory: "A" | "B" | "AB" | "C" | "D" | "E";
    licenseExpiresAt: Date;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zipCode?: string | undefined;
}, {
    name: string;
    email: string;
    document: string;
    phone: string;
    licenseNumber: string;
    licenseCategory: "A" | "B" | "AB" | "C" | "D" | "E";
    licenseExpiresAt: Date;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zipCode?: string | undefined;
}>;
export declare const updateDriverSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    document: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    licenseNumber: z.ZodOptional<z.ZodString>;
    licenseCategory: z.ZodOptional<z.ZodEnum<["A", "B", "AB", "C", "D", "E"]>>;
    licenseExpiresAt: z.ZodOptional<z.ZodEffects<z.ZodDate, Date, Date>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    state: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    zipCode: z.ZodOptional<z.ZodOptional<z.ZodString>>;
} & {
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE", "SUSPENDED"]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    document?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zipCode?: string | undefined;
    licenseNumber?: string | undefined;
    licenseCategory?: "A" | "B" | "AB" | "C" | "D" | "E" | undefined;
    licenseExpiresAt?: Date | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    document?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    zipCode?: string | undefined;
    licenseNumber?: string | undefined;
    licenseCategory?: "A" | "B" | "AB" | "C" | "D" | "E" | undefined;
    licenseExpiresAt?: Date | undefined;
}>;
export declare const filterDriverSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    document: z.ZodOptional<z.ZodString>;
    licenseNumber: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE", "SUSPENDED"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    name?: string | undefined;
    document?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
    licenseNumber?: string | undefined;
}, {
    name?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    document?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | undefined;
    licenseNumber?: string | undefined;
}>;
export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
export type FilterDriverInput = z.infer<typeof filterDriverSchema>;
//# sourceMappingURL=driver.validator.d.ts.map