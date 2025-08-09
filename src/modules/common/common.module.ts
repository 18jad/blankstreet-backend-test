import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { AuthController, HealthController } from "./controller";
import { LogInterceptor, PaginationPipe } from "./flow";
import { configProvider, LoggerService, PrismaService } from "./provider";

@Module({
    imports: [TerminusModule],
    providers: [
        configProvider,
        LoggerService,
        LogInterceptor,
        PrismaService,
        PaginationPipe,
    ],
    exports: [
        configProvider,
        LoggerService,
        LogInterceptor,
        PrismaService,
        PaginationPipe,
    ],
    controllers: [HealthController, AuthController],
})
export class CommonModule {}
