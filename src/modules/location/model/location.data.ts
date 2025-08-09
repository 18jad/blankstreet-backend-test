import { ApiProperty } from "@nestjs/swagger";
import { Location } from "@prisma/client";

export class LocationData {
    @ApiProperty({ description: "Location unique ID" })
    public readonly id: number;

    @ApiProperty({ description: "Location name" })
    public readonly name: string;

    @ApiProperty({ description: "Timezone (IANA)" })
    public readonly timezone: string;

    @ApiProperty({ description: "Currency code (ISO 4217)" })
    public readonly currencyCode: string;

    @ApiProperty({
        description: "Tax rate in basis points (e.g., 1000 = 10.00%)",
    })
    public readonly taxRateBps: number;

    public constructor(entity: Location) {
        this.id = entity.id;
        this.name = entity.name;
        this.timezone = entity.timezone;
        this.currencyCode = entity.currencyCode;
        this.taxRateBps = entity.taxRateBps ?? 0;
    }
}
