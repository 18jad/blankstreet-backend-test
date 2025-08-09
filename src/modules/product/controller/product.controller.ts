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
import { AdminGuard, CustomerGuard } from "../../common";

import { ProductListPipe } from "../flow/product-list.pipe";
import { ProductData, ProductInput } from "../model";
import { ProductListQuery } from "../model/product.query";
import { ProductService } from "../service";

@Controller("products")
@ApiTags("Products")
@ApiBearerAuth()
export class ProductController {
    public constructor(private readonly service: ProductService) {}

    @Get()
    @ApiOperation({ summary: "[Customer] List products" })
    @ApiResponse({ status: HttpStatus.OK, isArray: false, type: ProductData })
    @UseGuards(CustomerGuard)
    public async list(
        @Query(ProductListPipe) query: ProductListQuery
    ): Promise<any> {
        return this.service.list(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "[Customer] Get product by ID" })
    @ApiResponse({ status: HttpStatus.OK, type: ProductData })
    @UseGuards(CustomerGuard)
    public async getById(
        @Param("id", ParseIntPipe) id: number
    ): Promise<ProductData> {
        return this.service.getById(id);
    }

    @Post()
    @ApiOperation({ summary: "[Admin] Create product" })
    @ApiResponse({ status: HttpStatus.CREATED, type: ProductData })
    @UseGuards(AdminGuard)
    public async create(@Body() input: ProductInput): Promise<ProductData> {
        return this.service.create(input);
    }
}
