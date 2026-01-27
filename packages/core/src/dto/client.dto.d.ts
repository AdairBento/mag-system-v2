export declare class CreateClientDto {
    name: string;
    email: string;
    phone: string;
    document: string;
    documentType: 'CPF' | 'CNPJ';
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}
export declare class UpdateClientDto {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    documentType?: 'CPF' | 'CNPJ';
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
}
export interface ClientResponseDto {
    id: string;
    name: string;
    email: string;
    phone: string;
    document: string;
    documentType: 'CPF' | 'CNPJ';
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export declare class FilterClientDto {
    name?: string;
    email?: string;
    document?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
    page?: number;
    limit?: number;
}
//# sourceMappingURL=client.dto.d.ts.map