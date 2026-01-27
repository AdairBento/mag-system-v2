import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto, FilterClientDto } from '@mag-system/core';
export declare class ClientsController {
    private clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: CreateClientDto): Promise<import("@mag-system/core").ClientResponseDto>;
    findAll(filters: FilterClientDto): Promise<import("@mag-system/core").PaginatedResponseDto<import("@mag-system/core").ClientResponseDto>>;
    findOne(id: string): Promise<import("@mag-system/core").ClientResponseDto>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<import("@mag-system/core").ClientResponseDto>;
    remove(id: string): Promise<void>;
}
//# sourceMappingURL=clients.controller.d.ts.map