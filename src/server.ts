import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { ApplicationModule } from "./modules/app.module";
import { CommonModule, LogInterceptor } from "./modules/common";

// API defaults, can be changed using environment variables, it is not required to change them (see the `.env` file)
const API_DEFAULT_PORT = 3000;
const API_DEFAULT_PREFIX = "/api/v1/";

// Swagger docs config
const SWAGGER_TITLE = "Blank Street Test";
const SWAGGER_DESCRIPTION = "API used for blank street test";
const SWAGGER_PREFIX = "/docs";
function createSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setDescription(SWAGGER_DESCRIPTION)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_PREFIX, app, document);
}

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
        ApplicationModule,
        new FastifyAdapter()
    );

    app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX);

    if (!process.env.SWAGGER_ENABLE || process.env.SWAGGER_ENABLE === "1") {
        createSwagger(app);
    }

    const logInterceptor = app.select(CommonModule).get(LogInterceptor);
    app.useGlobalInterceptors(logInterceptor);

    await app.listen(process.env.API_PORT || API_DEFAULT_PORT);
}

// Any major error that can not be handled by NestJS will be caught in the code
// below. The default behavior is to display the error on stdout and quit.
bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);

    const defaultExitCode = 1;
    process.exit(defaultExitCode);
});
