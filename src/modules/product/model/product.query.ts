import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { PaginationInput } from "../../common";

export type ProductSortableField = Extract<
    Prisma.ProductScalarFieldEnum,
    "createdAt" | "name" | "isActive" | "basePriceCents"
>;

export class ProductListQuery extends PaginationInput<ProductSortableField> {
    @ApiPropertyOptional({
        enum: ["createdAt", "name", "isActive", "basePriceCents"],
        default: "createdAt",
    })
    public readonly sortBy?: ProductSortableField = "createdAt";

    @ApiPropertyOptional({ enum: ["asc", "desc"], default: "desc" })
    public readonly sortDir?: "asc" | "desc" = "desc";
}
