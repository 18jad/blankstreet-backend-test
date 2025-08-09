import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { ProductData } from "./product.data";

export class ProductInput extends PickType(ProductData, [
    "name",
    "basePriceCents",
    "currencyCode",
    "isActive",
] as const) {
    @ApiPropertyOptional({ description: "SKU" })
    public readonly sku?: string;
}
