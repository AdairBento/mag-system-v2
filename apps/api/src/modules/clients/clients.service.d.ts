import { PrismaService } from '../../database/prisma.service';
import { CreateClientDto, UpdateClientDto, FilterClientDto, ClientResponseDto, PaginatedResponseDto } from '@mag-system/core';
export declare class ClientsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createClientDto: CreateClientDto): Promise<ClientResponseDto>;
    findAll(filters: FilterClientDto): Promise<PaginatedResponseDto<ClientResponseDto>>;
    findOne(id: string): Promise<ClientResponseDto>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<ClientResponseDto>;
    remove(id: string): Promise<void>;
}
//# sourceMappingURL=clients.service.d.ts.map