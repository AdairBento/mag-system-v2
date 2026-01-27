import { z } from 'zod';
export declare const createRentalSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    clientId: z.ZodString;
    driverId: z.ZodString;
    vehicleId: z.ZodString;
    startDate: z.ZodDate;
    endDate: z.ZodDate;
    dailyRate: z.ZodNumber;
    deposit: z.ZodDefault<z.ZodNumber>;
    discount: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    dailyRate: number;
    clientId: string;
    driverId: string;
    vehicleId: string;
    startDate: Date;
    endDate: Date;
    deposit: number;
    discount: number;
    notes?: string | undefined;
}, {
    dailyRate: number;
    clientId: string;
    driverId: string;
    vehicleId: string;
    startDate: Date;
    endDate: Date;
    deposit?: number | undefined;
    discount?: number | undefined;
    notes?: string | undefined;
}>, {
    dailyRate: number;
    clientId: string;
    driverId: string;
    vehicleId: string;
    startDate: Date;
    endDate: Date;
    deposit: number;
    discount: number;
    notes?: string | undefined;
}, {
    dailyRate: number;
    clientId: string;
    driverId: string;
    vehicleId: string;
    startDate: Date;
    endDate: Date;
    deposit?: number | undefined;
    discount?: number | undefined;
    notes?: string | undefined;
}>, {
    dailyRate: number;
    clientId: string;
    driverId: string;
    vehicleId: string;
    startDate: Date;
    endDate: Date;
    deposit: number;
    discount: number;
    notes?: string | undefined;
}, {
    dailyRate: number;
    clientId: string;
    driverId: string;
    vehicleId: string;
    startDate: Date;
    endDate: Date;
    deposit?: number | undefined;
    discount?: number | undefined;
    notes?: string | undefined;
}>;
export declare const updateRentalSchema: z.ZodObject<{
    clientId: z.ZodOptional<z.ZodString>;
    driverId: z.ZodOptional<z.ZodString>;
    vehicleId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    dailyRate: z.ZodOptional<z.ZodNumber>;
    deposit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    discount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
} & {
    returnDate: z.ZodOptional<z.ZodDate>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED" | undefined;
    dailyRate?: number | undefined;
    clientId?: string | undefined;
    driverId?: string | undefined;
    vehicleId?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    deposit?: number | undefined;
    discount?: number | undefined;
    notes?: string | undefined;
    returnDate?: Date | undefined;
}, {
    status?: "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED" | undefined;
    dailyRate?: number | undefined;
    clientId?: string | undefined;
    driverId?: string | undefined;
    vehicleId?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    deposit?: number | undefined;
    discount?: number | undefined;
    notes?: string | undefined;
    returnDate?: Date | undefined;
}>;
export declare const filterRentalSchema: z.ZodObject<{
    clientId: z.ZodOptional<z.ZodString>;
    driverId: z.ZodOptional<z.ZodString>;
    vehicleId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]>>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED" | undefined;
    clientId?: string | undefined;
    driverId?: string | undefined;
    vehicleId?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    status?: "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED" | undefined;
    clientId?: string | undefined;
    driverId?: string | undefined;
    vehicleId?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}>;
export type CreateRentalInput = z.infer<typeof createRentalSchema>;
export type UpdateRentalInput = z.infer<typeof updateRentalSchema>;
export type FilterRentalInput = z.infer<typeof filterRentalSchema>;
//# sourceMappingURL=rental.validator.d.ts.map