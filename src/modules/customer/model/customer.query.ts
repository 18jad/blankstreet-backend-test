import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { PaginationInput } from "../../common";

export type CustomerSortableField = Extract<
    Prisma.CustomerScalarFieldEnum,
    "createdAt" | "name" | "email"
>;

export class CustomerListQuery extends PaginationInput<CustomerSortableField> {
    @ApiPropertyOptional({
        enum: ["createdAt", "name", "email"],
        default: "createdAt",
    })
    public readonly sortBy?: CustomerSortableField = "createdAt";

    @ApiPropertyOptional({ enum: ["asc", "desc"], default: "desc" })
    public readonly sortDir?: "asc" | "desc" = "desc";
}
