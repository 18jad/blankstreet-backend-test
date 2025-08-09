import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, PrismaHealthIndicator } from "@nestjs/terminus";

import { PrismaService } from "../provider";

@Controller("health")
export class HealthController {
    public constructor(
        private readonly health: HealthCheckService,
        private readonly database: PrismaHealthIndicator,
        private readonly prisma: PrismaService
    ) {}

    @Get()
    public async healthCheck() {
        const res = await this.health.check([
            async () => this.database.pingCheck("database", this.prisma),
            () => ({
                http: {
                    status: "up",
                    uptime: process.uptime(),
                },
            }),
        ]);

        return {
            status: res.status,
            error: res.error,
            details: res.details,
        };
    }
}
