import { EventOverrideDisplayModel } from "./../../event-overrides/dto/event-override.display-model";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { ChildCalendarEventDisplayModel } from "./child-calendar-event.display-model";
import { ChildEventRecipientMappingDisplayModel } from "../../event-recipient-mappings/dto/child-event-recipient-mapping-display-model";
export class CalendarEventDisplayModel extends ChildCalendarEventDisplayModel {
  @ApiPropertyOptional({
    type: ChildEventRecipientMappingDisplayModel,
    isArray: true,
  })
  eventRecipientMappings?: ChildEventRecipientMappingDisplayModel[];

  @ApiPropertyOptional({
    type: EventOverrideDisplayModel,
    isArray: true,
  })
  eventOverrides?: EventOverrideDisplayModel[];
}
