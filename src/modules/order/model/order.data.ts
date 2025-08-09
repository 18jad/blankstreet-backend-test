import { ApiProperty } from "@nestjs/swagger";
import { Order, OrderItem, OrderStatus } from "@prisma/client";

export class OrderItemData {
    @ApiProperty({ description: "Order item unique ID" })
    public readonly id: string;

    @ApiProperty({ description: "Product ID" })
    public readonly productId: number;

    @ApiProperty({ description: "Quantity" })
    public readonly quantity: number;

    @ApiProperty({ description: "Unit price in minor units" })
    public readonly unitPriceCents: number;

    @ApiProperty({ description: "Tax in minor units" })
    public readonly taxCents: number;

    @ApiProperty({ description: "Total price in minor units" })
    public readonly totalPriceCents: number;

    public constructor(entity: OrderItem) {
        this.id = entity.id.toString();
        this.productId = entity.productId;
        this.quantity = entity.quantity;
        this.unitPriceCents = entity.unitPriceCents;
        this.taxCents = entity.taxCents;
        this.totalPriceCents = entity.totalPriceCents;
    }
}

export class OrderData {
    @ApiProperty({ description: "Order unique ID" })
    public readonly id: string;

    @ApiProperty({ description: "Customer ID" })
    public readonly customerId: number;

    @ApiProperty({ description: "Location ID" })
    public readonly locationId: number;

    @ApiProperty({ description: "Currency code (ISO 4217)" })
    public readonly currencyCode: string;

    @ApiProperty({ enum: OrderStatus })
    public readonly status: OrderStatus;

    @ApiProperty({ description: "Subtotal in minor units" })
    public readonly subtotalCents: number;

    @ApiProperty({ description: "Discount in minor units" })
    public readonly discountCents: number;

    @ApiProperty({ description: "Tax in minor units" })
    public readonly taxCents: number;

    @ApiProperty({ description: "Total in minor units" })
    public readonly totalCents: number;

    @ApiProperty({
        description: "Creation date",
        type: String,
        format: "date-time",
    })
    public readonly createdAt: Date;

    @ApiProperty({
        description: "Update date",
        type: String,
        format: "date-time",
    })
    public readonly updatedAt: Date;

    @ApiProperty({ type: [OrderItemData] })
    public readonly items: OrderItemData[];

    public constructor(entity: Order & { items?: OrderItem[] }) {
        this.id = entity.id.toString();
        this.customerId = entity.customerId;
        this.locationId = entity.locationId;
        this.currencyCode = entity.currencyCode;
        this.status = entity.status;
        this.subtotalCents = entity.subtotalCents;
        this.discountCents = entity.discountCents;
        this.taxCents = entity.taxCents;
        this.totalCents = entity.totalCents;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
        this.items = (entity.items ?? []).map((i) => new OrderItemData(i));
    }
}
