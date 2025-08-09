import { Injectable } from "@nestjs/common";
import { OrderStatus, Prisma } from "@prisma/client";

import { Page, PrismaService } from "../../common";
import { OrderData } from "../model";
import { OrderInput } from "../model/order.input";
import { OrderSearchQuery } from "../model/order.search.query";

@Injectable()
export class OrderService {
    public constructor(private readonly prisma: PrismaService) {}

    public async create(input: OrderInput): Promise<OrderData> {
        const location = await this.prisma.location.findUnique({
            where: { id: input.locationId },
            select: { id: true, currencyCode: true, taxRateBps: true },
        });
        if (!location) throw new Error("Location not found");

        const ids = input.items.map((i) => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: ids }, isActive: true },
            select: {
                id: true,
                basePriceCents: true,
                currencyCode: true,
                isActive: true,
                isTaxable: true,
            },
        });
        if (products.length !== ids.length)
            throw new Error("One or more products not found or inactive");

        const currency = products[0].currencyCode;
        if (!products.every((p) => p.currencyCode === currency))
            throw new Error("Mixed product currencies");
        if (currency !== location.currencyCode)
            throw new Error(
                "Product currency does not match location currency"
            );

        let subtotal = 0;
        const rate = location.taxRateBps; // basis points
        const itemsData = input.items.map((it) => {
            const product = products.find((p) => p.id === it.productId)!;
            const unitPrice = product.basePriceCents;
            const lineTotal = unitPrice * it.quantity;
            const itemTax = product.isTaxable
                ? Math.trunc((lineTotal * rate) / 10_000)
                : 0;
            subtotal += lineTotal;
            return {
                productId: it.productId,
                quantity: it.quantity,
                unitPriceCents: unitPrice,
                taxCents: itemTax,
                totalPriceCents: lineTotal + itemTax,
            };
        });

        const discountCents = 0;
        const taxCents = itemsData.reduce((sum, it) => sum + it.taxCents, 0);
        const totalCents = subtotal - discountCents + taxCents;

        const created = await this.prisma.order.create({
            data: {
                customerId: input.customerId,
                locationId: input.locationId,
                currencyCode: currency,
                status: OrderStatus.PENDING,
                subtotalCents: subtotal,
                discountCents,
                taxCents,
                totalCents,
                items: { createMany: { data: itemsData } },
            },
            include: { items: true },
        });

        return new OrderData(created);
    }

    public async getById(id: bigint): Promise<OrderData> {
        const entity = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!entity) throw new Error("Order not found");
        return new OrderData(entity);
    }

    public async search(query: OrderSearchQuery): Promise<Page<OrderData>> {
        const {
            page = 1,
            pageSize = 20,
            sortBy = "createdAt",
            sortDir = "desc",
            ...filters
        } = query;

        const AND: Prisma.OrderWhereInput[] = [];
        if (filters.customerId) AND.push({ customerId: filters.customerId });
        if (filters.locationId) AND.push({ locationId: filters.locationId });
        if (filters.status) AND.push({ status: filters.status });
        if (filters.createdFrom && filters.createdTo)
            AND.push({
                createdAt: {
                    gte: new Date(filters.createdFrom),
                    lte: new Date(filters.createdTo),
                },
            });

        const where: Prisma.OrderWhereInput = {
            AND,
            ...(filters.productId
                ? { items: { some: { productId: filters.productId } } }
                : {}),
        };

        const orderBy: Prisma.OrderOrderByWithRelationInput = {};
        if (sortBy === "createdAt") orderBy.createdAt = sortDir;
        if (sortBy === "totalCents") orderBy.totalCents = sortDir;
        if (sortBy === "status") orderBy.status = sortDir;

        const takePlusOne = pageSize + 1;
        const entities = await this.prisma.order.findMany({
            where,
            include: { items: true },
            orderBy,
            skip: (page - 1) * pageSize,
            take: takePlusOne,
        });
        const hasNextPage = entities.length > pageSize;
        const slice = hasNextPage ? entities.slice(0, pageSize) : entities;
        return {
            data: slice.map((e) => new OrderData(e)),
            hasNextPage,
            hasPreviousPage: page > 1,
        };
    }
}
