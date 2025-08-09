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

import { LocationListPipe } from "../flow/location-list.pipe";
import { LocationData, LocationInput } from "../model";
import { LocationListQuery } from "../model/location.query";
import { LocationService } from "../service";

@Controller("locations")
@ApiTags("Locations")
@ApiBearerAuth()
export class LocationController {
    public constructor(private readonly service: LocationService) {}

    @Get()
    @ApiOperation({ summary: "[Customer] List locations" })
    @ApiResponse({ status: HttpStatus.OK, isArray: false, type: LocationData })
    @UseGuards(CustomerGuard)
    public async list(
        @Query(LocationListPipe) query: LocationListQuery
    ): Promise<any> {
        return this.service.list(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "[Customer] Get location by ID" })
    @ApiResponse({ status: HttpStatus.OK, type: LocationData })
    @UseGuards(CustomerGuard)
    public async getById(
        @Param("id", ParseIntPipe) id: number
    ): Promise<LocationData> {
        return this.service.getById(id);
    }

    @Post()
    @ApiOperation({ summary: "[Admin] Create location" })
    @ApiResponse({ status: HttpStatus.CREATED, type: LocationData })
    @UseGuards(AdminGuard)
    public async create(@Body() input: LocationInput): Promise<LocationData> {
        return this.service.create(input);
    }
}
