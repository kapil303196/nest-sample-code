import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";
import {
  calendarEventIncludeEnum,
  getCalendarEventIncludeEnum,
} from "../../utils/constants/enum.constant";

export class GetCalendarEventDto {
  @ApiPropertyOptional({
    enum: getCalendarEventIncludeEnum,
    isArray: true,
  })
  @IsOptional()
  @IsIn(Object.values(getCalendarEventIncludeEnum), { each: true })
  include?: calendarEventIncludeEnum[];
}
