import { Module } from "@nestjs/common";
import { WinstonLogger } from ".";

@Module({
  providers: [WinstonLogger],
  exports: [WinstonLogger],
})
export class LoggerModule {}
