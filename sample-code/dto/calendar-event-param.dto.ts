import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CalendarEventParamDto {
  @ApiProperty({ example: "b401d806-659a-4f9d-b136-ea3e3c5eeac6" })
  @IsNotEmpty()
  @IsUUID()
  public eventId: string;
}
export class CalendarEventOverrideParamDto extends CalendarEventParamDto {
  @ApiProperty({ example: "6d2a34d5-f813-4d6c-8256-ed8a87d2cfaf" })
  @IsNotEmpty()
  @IsUUID()
  public overrideId: string;
}
