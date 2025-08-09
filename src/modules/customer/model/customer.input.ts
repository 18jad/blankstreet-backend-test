import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { CustomerData } from "./customer.data";

export class CustomerInput extends PickType(CustomerData, ["name"] as const) {
    @ApiPropertyOptional({ description: "Email address" })
    public readonly email?: string;
}
