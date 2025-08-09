## Blank Street Order Management API

NestJS + Fastify API with Prisma, Swagger, Joi validation, and role based access (ADMIN, CUSTOMER).

### Requirements

- Node.js >= 20
- PostgreSQL (local or via Docker Compose)

### 1) Configure environment

Create `.env` from example and set values:

```
cp .env.example .env
```

Required keys:

- DATABASE_URL=postgresql://user:pass@localhost:5432/db
- JWT_SECRET=change-me
- JWT_ISSUER=LOCAL
- API_PORT=3000 (optional)
- API_PREFIX=/api/v1/ (optional)
- SWAGGER_ENABLE=1 (keep enabled for docs)

### 2) Install and generate Prisma client

```
npm ci
# npx prisma migrate dev --name init (if you are using a new/local database)
npx prisma generate
```

### 3) Run the API

```
npm run dev
```

Swagger is at http://localhost:3000/docs. API routes are prefixed (default /api/v1).

### 4) Auth and roles

- Generate tokens in Swagger:
  - POST /api/v1/auth/admin-token → ADMIN token
  - POST /api/v1/auth/customer-token → CUSTOMER token
- Click “Authorize” in Swagger and paste: `<token>`

### 5) What each role can do

- CUSTOMER
  - GET /locations, GET /locations/{id}
  - GET /products, GET /products/{id}
  - POST /orders
- ADMIN
  - POST /locations, POST /products
  - GET /orders, GET /orders/{id}
  - Manage customers (list/get/create)

### 6) Money and pricing

- All amounts are stored as minor units (e.g., cents). `currencyCode` is ISO 4217 (e.g. USD, EUR, etc.).
- Orders compute prices from Product records and compute tax using `Location.taxRateBps` for taxable products.

### 7) Pagination

- List/search endpoints return:

```
{
  data: [...],
  hasNextPage: boolean,
  hasPreviousPage: boolean
}
```

### 8) Health check

```
curl http://localhost:3000/api/v1/health
```

### 9) Notes

- I added the .env to the repo for testing purposes only.
- I added online hosted database for testing purposes.
