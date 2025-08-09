import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { Page, PrismaService } from "../../common";
import { ProductData, ProductInput } from "../model";
import { ProductListQuery } from "../model/product.query";

@Injectable()
export class ProductService {
    public constructor(private readonly prisma: PrismaService) {}

    public async list({
        page = 1,
        pageSize = 20,
        sortBy = "createdAt",
        sortDir = "desc",
    }: ProductListQuery): Promise<Page<ProductData>> {
        const orderBy: Prisma.ProductOrderByWithRelationInput = {};
        if (sortBy === "createdAt") orderBy.createdAt = sortDir;
        if (sortBy === "name") orderBy.name = sortDir;
        if (sortBy === "isActive") orderBy.isActive = sortDir;
        if (sortBy === "basePriceCents") orderBy.basePriceCents = sortDir;

        const takePlusOne = pageSize + 1;
        const items = await this.prisma.product.findMany({
            orderBy: Object.keys(orderBy).length ? orderBy : undefined,
            skip: (page - 1) * pageSize,
            take: takePlusOne,
        });
        const hasNextPage = items.length > pageSize;
        const slice = hasNextPage ? items.slice(0, pageSize) : items;
        return {
            data: slice.map((i) => new ProductData(i)),
            hasNextPage,
            hasPreviousPage: page > 1,
        };
    }

    public async getById(id: number): Promise<ProductData> {
        const entity = await this.prisma.product.findUnique({ where: { id } });
        if (!entity) throw new NotFoundException("Product not found");
        return new ProductData(entity);
    }

    public async create(input: ProductInput): Promise<ProductData> {
        const entity = await this.prisma.product.create({ data: input });
        return new ProductData(entity);
    }
}
