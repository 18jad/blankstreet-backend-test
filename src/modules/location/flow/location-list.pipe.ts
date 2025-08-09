import { Injectable } from "@nestjs/common";
import * as Joi from "joi";
import { JoiValidationPipe } from "../../common";

@Injectable()
export class LocationListPipe extends JoiValidationPipe {
    public buildSchema(): Joi.Schema {
        return Joi.object({
            page: Joi.number().integer().min(1).default(1),
            pageSize: Joi.number().integer().min(1).max(100).default(20),
            sortBy: Joi.string()
                .valid("createdAt", "name", "timezone", "currencyCode")
                .default("createdAt"),
            sortDir: Joi.string().valid("asc", "desc").default("desc"),
        });
    }
}
