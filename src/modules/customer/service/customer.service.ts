import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { Page, PrismaService } from "../../common";
import { CustomerData, CustomerInput } from "../model";
import { CustomerListQuery } from "../model/customer.query";

@Injectable()
export class CustomerService {
    public constructor(private readonly prisma: PrismaService) {}

    public async list({
        page = 1,
        pageSize = 20,
        sortBy = "createdAt",
        sortDir = "desc",
    }: CustomerListQuery): Promise<Page<CustomerData>> {
        const orderBy: Prisma.CustomerOrderByWithRelationInput = {};
        if (sortBy === "createdAt") orderBy.createdAt = sortDir;
        if (sortBy === "name") orderBy.name = sortDir;
        if (sortBy === "email") orderBy.email = sortDir;

        const takePlusOne = pageSize + 1;
        const items = await this.prisma.customer.findMany({
            orderBy: Object.keys(orderBy).length ? orderBy : undefined,
            skip: (page - 1) * pageSize,
            take: takePlusOne,
        });
        const hasNextPage = items.length > pageSize;
        const slice = hasNextPage ? items.slice(0, pageSize) : items;
        return {
            data: slice.map((i) => new CustomerData(i)),
            hasNextPage,
            hasPreviousPage: page > 1,
        };
    }

    public async getById(id: number): Promise<CustomerData> {
        const entity = await this.prisma.customer.findUnique({ where: { id } });
        if (!entity) throw new NotFoundException("Customer not found");
        return new CustomerData(entity);
    }

    public async create(data: CustomerInput): Promise<CustomerData> {
        const entity = await this.prisma.customer.create({ data });
        return new CustomerData(entity);
    }
}
