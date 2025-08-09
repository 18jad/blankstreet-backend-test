import { faker } from "@faker-js/faker";
import { OrderStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CURRENCIES = ["USD", "EUR", "GBP"] as const;

function pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedCustomers(count = 50) {
    const data = Array.from({ length: count }).map(() => ({
        name: faker.person.fullName(),
        email: faker.datatype.boolean()
            ? faker.internet.email().toLowerCase()
            : null,
    }));
    await prisma.customer.createMany({ data, skipDuplicates: true });
}

async function seedLocations(count = 50) {
    const data = Array.from({ length: count }).map(() => ({
        name: `${faker.location.city()} ${faker.company.buzzNoun()}`.slice(
            0,
            50
        ),
        timezone: faker.location.timeZone(),
        currencyCode: pick(CURRENCIES),
        taxRateBps: faker.number.int({ min: 0, max: 1500 }), // up to 15%
    }));
    await prisma.location.createMany({ data, skipDuplicates: true });
}

async function seedProducts(count = 50) {
    const data = Array.from({ length: count }).map(() => {
        const currency = pick(CURRENCIES);
        return {
            sku: faker.datatype.boolean()
                ? faker.string.alphanumeric({ length: 8 }).toUpperCase()
                : null,
            name: faker.commerce.productName(),
            basePriceCents: faker.number.int({ min: 200, max: 20000 }),
            currencyCode: currency,
            isActive: true,
            isTaxable: faker.datatype.boolean(),
        };
    });
    await prisma.product.createMany({ data, skipDuplicates: true });
}

async function seedOrders(count = 50) {
    const customers = await prisma.customer.findMany({ select: { id: true } });
    const locations = await prisma.location.findMany({
        select: { id: true, currencyCode: true, taxRateBps: true },
    });
    const productsByCurrency: Record<
        string,
        {
            id: number;
            basePriceCents: number;
            currencyCode: string;
            isTaxable: boolean;
        }[]
    > = {};
    for (const cur of CURRENCIES) {
        productsByCurrency[cur] = await prisma.product.findMany({
            where: { currencyCode: cur, isActive: true },
            select: {
                id: true,
                basePriceCents: true,
                currencyCode: true,
                isTaxable: true,
            },
        });
    }

    for (let i = 0; i < count; i++) {
        const customer = pick(customers);
        const location = pick(locations);
        const pool = productsByCurrency[location.currencyCode] ?? [];
        if (!customer || !location || pool.length === 0) continue;

        const numItems = faker.number.int({ min: 1, max: 3 });
        const chosen = faker.helpers.arrayElements(pool, numItems);

        let subtotal = 0;
        let tax = 0;
        const items = chosen.map((p) => {
            const quantity = faker.number.int({ min: 1, max: 5 });
            const line = p.basePriceCents * quantity;
            const itemTax = p.isTaxable
                ? Math.trunc((line * location.taxRateBps) / 10_000)
                : 0;
            subtotal += line;
            tax += itemTax;
            return {
                productId: p.id,
                quantity,
                unitPriceCents: p.basePriceCents,
                taxCents: itemTax,
                totalPriceCents: line + itemTax,
            };
        });

        const discountCents = 0;
        const total = subtotal - discountCents + tax;

        await prisma.order.create({
            data: {
                customerId: customer.id,
                locationId: location.id,
                currencyCode: location.currencyCode,
                status: OrderStatus.PENDING,
                subtotalCents: subtotal,
                discountCents,
                taxCents: tax,
                totalCents: total,
                items: { createMany: { data: items } },
            },
        });
    }
}

async function main() {
    console.log("Seeding...");
    await seedCustomers(50);
    await seedLocations(50);
    await seedProducts(50);
    await seedOrders(50);
    console.log("Done.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
