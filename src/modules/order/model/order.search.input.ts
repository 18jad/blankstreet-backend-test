import { ApiPropertyOptional } from "@nestjs/swagger";

export class OrderSearchInput {
    @ApiPropertyOptional({ description: "Customer ID filter" })
    public readonly customerId?: number;

    @ApiPropertyOptional({ description: "Location ID filter" })
    public readonly locationId?: number;

    @ApiPropertyOptional({
        description: "Product ID filter (orders containing product)",
    })
    public readonly productId?: number;

    @ApiPropertyOptional({
        description: "Order status filter",
        enum: ["PENDING", "PAID", "CANCELLED", "REFUNDED"],
    })
    public readonly status?: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";

    @ApiPropertyOptional({
        description: "From date ISO (inclusive)",
        type: String,
        format: "date-time",
    })
    public readonly createdFrom?: string;

    @ApiPropertyOptional({
        description: "To date ISO (inclusive)",
        type: String,
        format: "date-time",
    })
    public readonly createdTo?: string;
}
