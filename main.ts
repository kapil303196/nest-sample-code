import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import { env } from "./utils/env/env";
import { swaggerLoader } from "./utils/loaders";
import { WinstonLogger } from "./utils/logger";

global["fetch"] = require("node-fetch");

async function bootstrap() {
  const logger = new WinstonLogger();
  try {
    const app = await NestFactory.create(AppModule, { logger });
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    env.swagger.enabled && swaggerLoader(app);
    await app.listen(env.app.port);
    logger.log(
      `Application is started http://${env.app.host}:${env.app.port}`,
      "bootstrap",
    );
  } catch (error) {
    logger.error(
      `Application is crashed: ${error.message}`,
      error.stack,
      "bootstrap",
    );
  }
}

bootstrap();
