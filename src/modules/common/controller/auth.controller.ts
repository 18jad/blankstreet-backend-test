import { Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import * as jwt from "jsonwebtoken";

import { Role } from "../../tokens";

class TokenResponse {
    token!: string;
}

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    @Post("admin-token")
    @ApiOperation({ summary: "Generate admin API token" })
    @ApiResponse({ status: HttpStatus.CREATED, type: TokenResponse })
    public async admin(): Promise<TokenResponse> {
        const token = jwt.sign(
            { role: Role.ADMIN },
            `${process.env.JWT_SECRET}`,
            {
                algorithm: "HS256",
                issuer: process.env.JWT_ISSUER,
            }
        );
        return { token };
    }

    @Post("customer-token")
    @ApiOperation({ summary: "Generate customer API token" })
    @ApiResponse({ status: HttpStatus.CREATED, type: TokenResponse })
    public async customer(): Promise<TokenResponse> {
        const token = jwt.sign(
            { role: Role.CUSTOMER },
            `${process.env.JWT_SECRET}`,
            {
                algorithm: "HS256",
                issuer: process.env.JWT_ISSUER,
            }
        );
        return { token };
    }
}
