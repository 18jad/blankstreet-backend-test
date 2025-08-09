import { Injectable } from "@nestjs/common";
import * as Joi from "joi";
import { JoiValidationPipe } from "./joi-validation.pipe";

@Injectable()
export class PaginationPipe extends JoiValidationPipe {
    public buildSchema(): Joi.Schema {
        return Joi.object({
            page: Joi.number().integer().min(1).default(1),
            pageSize: Joi.number().integer().min(1).max(100).default(20),
            sortBy: Joi.string().optional(),
            sortDir: Joi.string().valid("asc", "desc").default("desc"),
        });
    }
}
