import { Injectable } from "@nestjs/common";
import * as Joi from "joi";
import { JoiValidationPipe } from "../../common";

@Injectable()
export class CustomerListPipe extends JoiValidationPipe {
    public buildSchema(): Joi.Schema {
        return Joi.object({
            page: Joi.number().integer().min(1).default(1),
            pageSize: Joi.number().integer().min(1).max(100).default(20),
            sortBy: Joi.string()
                .valid("createdAt", "name", "email")
                .default("createdAt"),
            sortDir: Joi.string().valid("asc", "desc").default("desc"),
        });
    }
}
