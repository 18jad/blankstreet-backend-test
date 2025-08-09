import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { PaginationInput } from "../../common";

export type LocationSortableField = Extract<
    Prisma.LocationScalarFieldEnum,
    "createdAt" | "name" | "timezone" | "currencyCode"
>;

export class LocationListQuery extends PaginationInput<LocationSortableField> {
    @ApiPropertyOptional({
        enum: ["createdAt", "name", "timezone", "currencyCode"],
        default: "createdAt",
    })
    public readonly sortBy?: LocationSortableField = "createdAt";

    @ApiPropertyOptional({ enum: ["asc", "desc"], default: "desc" })
    public readonly sortDir?: "asc" | "desc" = "desc";
}
