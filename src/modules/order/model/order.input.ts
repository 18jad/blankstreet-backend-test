import { ApiProperty } from "@nestjs/swagger";

export class OrderItemInput {
    @ApiProperty({ description: "Product ID" })
    public readonly productId: number;

    @ApiProperty({ description: "Quantity", default: 1 })
    public readonly quantity: number = 1;
}

export class OrderInput {
    @ApiProperty({ description: "Customer ID" })
    public readonly customerId: number;

    @ApiProperty({ description: "Location ID" })
    public readonly locationId: number;

    @ApiProperty({ type: [OrderItemInput] })
    public readonly items: OrderItemInput[];
}
