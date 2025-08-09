import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { OrderSearchInput } from "./order.search.input";

export type OrderSortableField = Extract<
    Prisma.OrderScalarFieldEnum,
    "createdAt" | "totalCents" | "status"
>;

export class OrderSearchQuery extends OrderSearchInput {
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

    @ApiPropertyOptional({
        enum: ["createdAt", "totalCents", "status"],
        default: "createdAt",
    })
    public readonly sortBy?: OrderSortableField = "createdAt";

    @ApiPropertyOptional({ enum: ["asc", "desc"], default: "desc" })
    public readonly sortDir?: "asc" | "desc" = "desc";
}
