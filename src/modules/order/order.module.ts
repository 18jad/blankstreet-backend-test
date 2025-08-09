import { Module } from "@nestjs/common";

import { CommonModule } from "../common";
import { OrderController } from "./controller";
import { OrderService } from "./service";

@Module({
    imports: [CommonModule],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
