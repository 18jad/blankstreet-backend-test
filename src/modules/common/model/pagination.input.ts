import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationInput<TSort extends string = string> {
    @ApiPropertyOptional({
        description: "Page number (1-based)",
        example: 1,
        default: 1,
        minimum: 1,
    })
    public readonly page?: number = 1;

    @ApiPropertyOptional({
        description: "Page size (max 100)",
        example: 20,
        default: 20,
        minimum: 1,
        maximum: 100,
    })
    public readonly pageSize?: number = 20;

    @ApiPropertyOptional({ description: "Sort by field", example: "createdAt" })
    public readonly sortBy?: TSort;

    @ApiPropertyOptional({
        description: "Sort direction",
        example: "desc",
        enum: ["asc", "desc"],
        default: "desc",
    })
    public readonly sortDir?: "asc" | "desc" = "desc";
}
