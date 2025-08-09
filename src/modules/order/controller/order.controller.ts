import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { AdminGuard, CustomerGuard } from "../../common";

import { Page } from "../../common";
import { OrderSearchPipe } from "../flow";
import { OrderData } from "../model";
import { OrderInput } from "../model/order.input";
import { OrderSearchQuery } from "../model/order.search.query";
import { OrderService } from "../service";

@Controller("orders")
@ApiTags("Orders")
@ApiBearerAuth()
export class OrderController {
    public constructor(private readonly service: OrderService) {}

    @Post()
    @ApiOperation({ summary: "[Customer] Create order" })
    @ApiResponse({ status: HttpStatus.CREATED, type: OrderData })
    @ApiTags("customer")
    @UseGuards(CustomerGuard)
    public async create(@Body() input: OrderInput): Promise<OrderData> {
        return this.service.create(input);
    }

    @Get(":id")
    @ApiOperation({ summary: "[Admin] Get order by ID" })
    @ApiResponse({ status: HttpStatus.OK, type: OrderData })
    @ApiTags("admin")
    @UseGuards(AdminGuard)
    public async getById(@Param("id") id: string): Promise<OrderData> {
        return this.service.getById(BigInt(id));
    }

    @Get()
    @ApiOperation({ summary: "[Admin] Search orders" })
    @ApiResponse({ status: HttpStatus.OK, isArray: false, type: OrderData })
    @ApiTags("admin")
    @UseGuards(AdminGuard)
    public async search(
        @Query(OrderSearchPipe) query: OrderSearchQuery
    ): Promise<Page<OrderData>> {
        return this.service.search(query);
    }
}
