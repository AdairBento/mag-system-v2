export declare class PaginationDto {
    page?: number;
    limit?: number;
}
export interface PaginatedResponseDto<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
//# sourceMappingURL=pagination.dto.d.ts.map