import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import {
  assignmentTypeEnum,
  calendarEventTagEnum,
  localeEnum,
} from "../../utils/constants/enum.constant";
import { v4 as uuid } from "uuid";
import { ScheduleDetailDto } from "../../core/dto";
import { Type } from "class-transformer";

export class AddCalendarEventDto {
  @ApiProperty({ example: uuid() })
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @ApiProperty({ example: "Event Title" })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: "Detailed description of the event" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ default: localeEnum.EN_US })
  @IsNotEmpty()
  @IsIn(Object.values(localeEnum))
  locale: localeEnum;

  @ApiProperty({
    example: new Date().toISOString(),
    description: "Start time of the event. i.e. start-date + start-time in UTC",
  })
  @IsNotEmpty()
  @IsDateString()
  startDateTime: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: "End time of the event. i.e. end-date + end-time in UTC",
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  endDateTime?: Date;

  @ApiProperty({ enum: calendarEventTagEnum, isArray: true })
  @IsNotEmpty()
  @IsIn(Object.values(calendarEventTagEnum), { each: true })
  eventTags: calendarEventTagEnum[];

  @ApiPropertyOptional({ example: { key: "value" } })
  @IsOptional()
  metadata?: { [key: string]: string };

  @ApiProperty({ type: ScheduleDetailDto })
  @ValidateNested()
  @Type(() => ScheduleDetailDto)
  recurringConfiguration: ScheduleDetailDto;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  reminderInMinutesBeforeEvent?: number;

  @ApiPropertyOptional({ default: assignmentTypeEnum.SPECIFIC_SUBSCRIBER })
  @IsNotEmpty()
  @IsIn(Object.values(assignmentTypeEnum))
  assignmentType: assignmentTypeEnum;

  @ApiPropertyOptional({ type: String, isArray: true, example: [uuid()] })
  @IsOptional()
  @IsUUID(undefined, { each: true })
  includeSubscriberIds?: string[];

  @ApiPropertyOptional({ type: String, isArray: true, example: [uuid()] })
  @IsOptional()
  @IsUUID(undefined, { each: true })
  excludeSubscriberIds?: string[];

  @ApiPropertyOptional({ type: String, isArray: true, example: [uuid()] })
  @IsOptional()
  @IsUUID(undefined, { each: true })
  excludeOrganizationIds?: string[];
}
