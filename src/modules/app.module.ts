import { Module } from "@nestjs/common";

import { CommonModule } from "./common";
import { CustomerModule } from "./customer/customer.module";
import { LocationModule } from "./location/location.module";
import { OrderModule } from "./order/order.module";
import { ProductModule } from "./product/product.module";

@Module({
    imports: [
        CommonModule,
        CustomerModule,
        LocationModule,
        ProductModule,
        OrderModule,
    ],
})
export class ApplicationModule {}
