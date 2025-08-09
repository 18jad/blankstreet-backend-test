import { Injectable } from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import * as Joi from "joi";
import { JoiValidationPipe } from "../../common";

@Injectable()
export class OrderSearchPipe extends JoiValidationPipe {
    public buildSchema(): Joi.Schema {
        return Joi.object({
            customerId: Joi.number().integer().optional(),
            locationId: Joi.number().integer().optional(),
            productId: Joi.number().integer().optional(),
            status: Joi.string()
                .valid(...Object.values(OrderStatus))
                .optional(),
            createdFrom: Joi.string().isoDate().optional(),
            createdTo: Joi.string().isoDate().optional(),
            page: Joi.number().integer().min(1).default(1),
            pageSize: Joi.number().integer().min(1).max(100).default(20),
            sortBy: Joi.string()
                .valid("createdAt", "totalCents", "status")
                .default("createdAt"),
            sortDir: Joi.string().valid("asc", "desc").default("desc"),
        }).with("createdFrom", "createdTo");
    }
}
