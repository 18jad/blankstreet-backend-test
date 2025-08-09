import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { Role } from "../../tokens";
import { extractTokenPayload } from "./security-utils";

@Injectable()
export class CustomerGuard implements CanActivate {
    public canActivate(context: ExecutionContext): boolean {
        const payload = extractTokenPayload(
            context.switchToHttp().getRequest<FastifyRequest>()
        );
        return !!payload && payload.role === Role.CUSTOMER;
    }
}
