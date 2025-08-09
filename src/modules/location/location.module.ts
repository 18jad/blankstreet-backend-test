import { Module } from "@nestjs/common";

import { CommonModule } from "../common";
import { LocationController } from "./controller";
import { LocationService } from "./service";

@Module({
    imports: [CommonModule],
    providers: [LocationService],
    controllers: [LocationController],
})
export class LocationModule {}
