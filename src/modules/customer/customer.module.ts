import { Module } from "@nestjs/common";

import { CommonModule } from "../common";
import { CustomerController } from "./controller";
import { CustomerService } from "./service";

@Module({
    imports: [CommonModule],
    providers: [CustomerService],
    controllers: [CustomerController],
    exports: [],
})
export class CustomerModule {}
