import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "@prisma/client";

export class CustomerData {
    @ApiProperty({ description: "Customer unique ID" })
    public readonly id: number;

    @ApiProperty({ description: "Customer full name" })
    public readonly name: string;

    @ApiProperty({ description: "Customer email", nullable: true })
    public readonly email?: string | null;

    public constructor(entity: Customer) {
        this.id = entity.id;
        this.name = entity.name;
        this.email = entity.email;
    }
}
