import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
  Version,
  Body,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { BaseController } from "../../core/api/base-controller";
import { ScheduleDetailDto } from "../../core/dto";
import { OrgRefDisplayModel } from "../../core/org-ref/dto";
import { PersonRefDisplayModel } from "../../core/person-ref/dto/person-ref.display-model";
import { CalendarEventApi } from "../../utils/api-summary/calendar-event.api";
import { GetReqUser } from "../../utils/auth/decorators/getReqUser.decorator";
import { Permissions } from "../../utils/auth/decorators/permissions.decorators";
import { User } from "../../utils/auth/dto/user.dto";
import { AuthorizedUserGuard } from "../../utils/auth/guards/Authorized-user-guard";
import { EcgError } from "../../utils/errors/ecg-error";
import {
  AddCalendarEventDto,
  CalendarEventDisplayModel,
  CalendarEventParamDto,
  GetCalendarEventDto,
} from "../dto";
import { CalendarEventService } from "../services/sample-code.service";
import { AddCalendarEventPipe } from "../pipes/add-calendar-event.pipe";

@ApiTags("Calendar-Events")
@ApiBearerAuth()
@UseGuards(AuthorizedUserGuard)
@ApiExtraModels(
  ScheduleDetailDto,
  PersonRefDisplayModel,
  OrgRefDisplayModel,
  CalendarEventDisplayModel
)
@Controller({ version: VERSION_NEUTRAL, path: "/api" })
export class CalendarEventController extends BaseController {
  constructor(private readonly calendarEventService: CalendarEventService) {
    super();
  }

  @Version(VERSION_NEUTRAL)
  @Permissions(...CalendarEventApi.save.permissions)
  @ApiOperation(CalendarEventApi.save.apiSummary)
  @ApiCreatedResponse({ type: CalendarEventDisplayModel })
  @HttpCode(201)
  @Post("/calendar-events")
  async create(
    @Body(AddCalendarEventPipe) data: AddCalendarEventDto,
    @GetReqUser() user: User
  ): Promise<CalendarEventDisplayModel | EcgError> {
    return this.getResult(
      await this.calendarEventService.addCalendarEvent(data, user)
    );
  }

  @Version(VERSION_NEUTRAL)
  @Permissions(...CalendarEventApi.getById.permissions)
  @ApiOperation(CalendarEventApi.getById.apiSummary)
  @ApiOkResponse({ type: CalendarEventDisplayModel })
  @HttpCode(200)
  @Get("/calendar-events/:eventId")
  async getById(
    @Param() params: CalendarEventParamDto,
    @Query() query: GetCalendarEventDto,
    @GetReqUser() user: User
  ): Promise<CalendarEventDisplayModel | EcgError> {
    return this.getResult(
      await this.calendarEventService.getCalendarEvent(params, user, query)
    );
  }
}
