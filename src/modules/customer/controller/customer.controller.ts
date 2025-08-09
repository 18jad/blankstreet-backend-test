import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
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
import { AdminGuard } from "../../common";

import { LoggerService } from "../../common";
import { CustomerListPipe } from "../flow/customer-list.pipe";
import { CustomerData, CustomerInput } from "../model";
import { CustomerListQuery } from "../model/customer.query";
import { CustomerService } from "../service";

@Controller("customers")
@ApiTags("admin")
@ApiBearerAuth()
export class CustomerController {
    public constructor(
        private readonly logger: LoggerService,
        private readonly customerService: CustomerService
    ) {}

    @Get()
    @ApiOperation({ summary: "List customers" })
    @ApiResponse({ status: HttpStatus.OK, isArray: true, type: CustomerData })
    @UseGuards(AdminGuard)
    public async list(@Query(CustomerListPipe) query: CustomerListQuery) {
        return this.customerService.list(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a customer by ID" })
    @ApiResponse({ status: HttpStatus.OK, type: CustomerData })
    @UseGuards(AdminGuard)
    public async getById(@Param("id", ParseIntPipe) id: number) {
        return this.customerService.getById(id);
    }

    @Post()
    @ApiOperation({ summary: "Create customer" })
    @ApiResponse({ status: HttpStatus.CREATED, type: CustomerData })
    @UseGuards(AdminGuard)
    public async create(@Body() input: CustomerInput) {
        const customer = await this.customerService.create(input);
        this.logger.info(`Created new customer ${customer.id}`);
        return customer;
    }
}
