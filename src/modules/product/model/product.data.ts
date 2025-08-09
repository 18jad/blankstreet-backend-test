import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@prisma/client";

export class ProductData {
    @ApiProperty({ description: "Product unique ID" })
    public readonly id: number;

    @ApiProperty({ description: "SKU (optional)", nullable: true })
    public readonly sku?: string | null;

    @ApiProperty({ description: "Product name" })
    public readonly name: string;

    @ApiProperty({ description: "Base price in minor units" })
    public readonly basePriceCents: number;

    @ApiProperty({ description: "Currency code (ISO 4217)" })
    public readonly currencyCode: string;

    @ApiProperty({ description: "Is active" })
    public readonly isActive: boolean;

    public constructor(entity: Product) {
        this.id = entity.id;
        this.sku = entity.sku;
        this.name = entity.name;
        this.basePriceCents = entity.basePriceCents;
        this.currencyCode = entity.currencyCode;
        this.isActive = entity.isActive;
    }
}
