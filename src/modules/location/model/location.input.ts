import { PickType } from "@nestjs/swagger";
import { LocationData } from "./location.data";

export class LocationInput extends PickType(LocationData, [
    "name",
    "timezone",
    "currencyCode",
] as const) {}
