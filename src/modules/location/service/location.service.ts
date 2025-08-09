import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { Page, PrismaService } from "../../common";
import { LocationData, LocationInput } from "../model";
import { LocationListQuery } from "../model/location.query";

@Injectable()
export class LocationService {
    public constructor(private readonly prisma: PrismaService) {}

    public async list({
        page = 1,
        pageSize = 20,
        sortBy = "createdAt",
        sortDir = "desc",
    }: LocationListQuery): Promise<Page<LocationData>> {
        const orderBy: Prisma.LocationOrderByWithRelationInput = {};
        if (sortBy === "createdAt") orderBy.createdAt = sortDir;
        if (sortBy === "name") orderBy.name = sortDir;
        if (sortBy === "timezone") orderBy.timezone = sortDir;
        if (sortBy === "currencyCode") orderBy.currencyCode = sortDir;

        const takePlusOne = pageSize + 1;
        const items = await this.prisma.location.findMany({
            orderBy: Object.keys(orderBy).length ? orderBy : undefined,
            skip: (page - 1) * pageSize,
            take: takePlusOne,
        });
        const hasNextPage = items.length > pageSize;
        const slice = hasNextPage ? items.slice(0, pageSize) : items;
        return {
            data: slice.map((i) => new LocationData(i)),
            hasNextPage,
            hasPreviousPage: page > 1,
        };
    }

    public async getById(id: number): Promise<LocationData> {
        const entity = await this.prisma.location.findUnique({ where: { id } });
        if (!entity) throw new NotFoundException("Location not found");
        return new LocationData(entity);
    }

    public async create(data: LocationInput): Promise<LocationData> {
        const entity = await this.prisma.location.create({ data });
        return new LocationData(entity);
    }
}
