import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ErrorOrganizationNotFound } from "../../core/org-ref/errors";
import {
  IOrgRefRepository,
  OrgRefRepository,
} from "../../core/org-ref/repositories/org-ref.repository";
import { ErrorPersonNotFound } from "../../core/person-ref/errors";
import {
  IPersonRefRepository,
  PersonRefRepository,
} from "../../core/person-ref/repositories/person-ref.repository";
import { EventRecipientMappingMapper } from "../../event-recipient-mappings/mappers/event-recipient-mapping.mapper";
import { EventRecipientMapping } from "../../event-recipient-mappings/models/event-recipient-mapping.model";
import { User } from "../../utils/auth/dto/user.dto";
import {,
  calendarEventPollyEnum,
  calendarEventRedisCacheEnum,
  eventRecipientMappingStatusEnum,
  hierarchyEnum,
} from "../../utils/constants/enum.constant";
import { calculateDateRange } from "../../utils/date-calculation";
import { EcgError } from "../../utils/errors/ecg-error";
import { WinstonLogger } from "../../utils/logger";
import { PagedCollection } from "../../utils/pagination/paged-collection";
import {
  AddCalendarEventDto,
  CalendarEventDisplayModel,
  CalendarEventListParamDto,
  CalendarEventParamDto,
  GetCalendarEventDto,
  ListCalendarEventDto,
} from "../dto";
import {
  ErrorAddingCalendarEvent,
  ErrorCalendarEventNotFound,
  ErrorCode,
  ErrorListCalendarEvent,
} from "../errors";
import { ErrorGetCalendarEvent } from "../errors/error-get-calendar-event";
import { CalendarEventValidation } from "../helpers/calendar-event.validation";
import { CalendarEventMapper } from "../mappers/calendar-event.mapper";
import {
  NullCalendarEvent,
} from "../models/sample-code.model";

@Injectable()
export class CalendarEventService {
  constructor(
    @Inject(PersonRefRepository)
    private _personRefRepository: IPersonRefRepository,
    @Inject(OrgRefRepository)
    private _orgRefRepository: IOrgRefRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: WinstonLogger,
  ) {
    this.logger.setScope(__filename);
  }

  async _validateIds(
    organizationId: string,
    subscriberIds: string[],
    organizationIds: string[],
    user: User,
  ): Promise<EcgError> {
    // Validate: Subscriber IDs
    if (subscriberIds?.length) {
      this.logger.info(
        `User: ${
          user?.sub
        } | Organization: ${organizationId} | Executing validate subscriber Ids: ${subscriberIds?.toString()}`,
      );
      const existing = await this._personRefRepository.getIds(subscriberIds);

      const personIds = existing?.map((e) => e?.id);

      const notFoundIds = subscriberIds?.filter(
        (id) => !personIds?.includes(id),
      );

      if (notFoundIds?.length) return new ErrorPersonNotFound(notFoundIds);
    } else if (organizationIds?.length) {
      // Validate: Organization IDs
      this.logger.info(
        `User: ${
          user?.sub
        } | Organization: ${organizationId} | Executing validate organization Ids: ${organizationIds?.toString()}`,
      );
      const existing = await this._orgRefRepository.getIds(organizationIds);

      const orgIds = existing?.map((e) => e?.id);

      const notFoundIds = organizationIds?.filter(
        (id) => !orgIds?.includes(id),
      );

      if (notFoundIds?.length)
        return new ErrorOrganizationNotFound(notFoundIds);
    }
  }

  async addCalendarEvent(
    data: AddCalendarEventDto,
    user: User,
  ): Promise<CalendarEventDisplayModel | EcgError> {
    try {
      this.logger.info(
        `User: ${user?.sub} | Organization: ${data.organizationId} | Executing add calendar event information with payload: ${JSON.stringify(data)}.`,
      );

      const orgCheck = await this._orgRefRepository.checkIfExists(
        data.organizationId,
      );

      if (!orgCheck) return new ErrorOrganizationNotFound(data.organizationId);

      // Validate: Calendar Event Request Body
      await CalendarEventValidation.validateAssignmentType(
        data.organizationId,
        data.assignmentType,
        {
          includeSubscriberIds: data?.includeSubscriberIds,
          excludeSubscriberIds: data?.excludeSubscriberIds,
          excludeOrganizationIds: data?.excludeOrganizationIds,
        },
      );

      const domain = CalendarEventMapper.toDomain(data, user);

      // Domain: Event Recipient Mapping
      let mappings: EventRecipientMapping[] = [];

      if (data?.includeSubscriberIds?.length) {
        // Validate Subscriber Ids
        const error = await this._validateIds(
          data.organizationId,
          data?.includeSubscriberIds,
          [],
          user,
        );
        if (error && error instanceof EcgError) return error;

        mappings = EventRecipientMappingMapper.toListSubscriberMapping(
          data.includeSubscriberIds,
          domain.id,
          eventRecipientMappingStatusEnum.INCLUDE,
          user,
        );
      }
      if (data?.excludeSubscriberIds?.length) {
        // Validate Subscriber Ids
        const error = await this._validateIds(
          data.organizationId,
          data?.excludeSubscriberIds,
          [],
          user,
        );
        if (error && error instanceof EcgError) return error;

        mappings = EventRecipientMappingMapper.toListSubscriberMapping(
          data.excludeSubscriberIds,
          domain.id,
          eventRecipientMappingStatusEnum.EXCLUDE,
          user,
        );
      }
      if (data?.excludeOrganizationIds?.length) {
        // Validate Organization Ids
        const error = await this._validateIds(
          data.organizationId,
          [],
          data?.excludeOrganizationIds,
          user,
        );
        if (error && error instanceof EcgError) return error;

        mappings = EventRecipientMappingMapper.toListOrgMapping(
          data.excludeOrganizationIds,
          domain.id,
          eventRecipientMappingStatusEnum.EXCLUDE,
          user,
        );
      }

      // Saves: Adds calendar event and event recipient Mappings
      await this._calendarEventRepository.createTransaction(domain, mappings);

      this.logger.info(
        `User: ${user?.sub} | Organization: ${data.organizationId} | Successfully added calendar event information with Id: ${domain.id}`,
      );

      // Side Effects
      // Add Polly Media files (i.e. audio and ssml files) for Calendar Event
      const mediaDto = CalendarEventMapper.toSideEffectMediaDto(domain, user);
      this.eventEmitter.emit(
        calendarEventPollyEnum.CALENDAR_EVENT_CREATE,
        mediaDto,
      );

      // Add Redis Cache for Calendar Event
      const cacheDto = CalendarEventMapper.toSideEffectCacheDto(
        domain.id,
        user,
        calendarEventRedisCacheEnum.CREATE,
      );
      this.eventEmitter.emit(calendarEventRedisCacheEnum.REDIS_SET, cacheDto);

      return CalendarEventMapper.toDto(domain);
    } catch (e) {
      this.logger.error(
        `User: ${user?.sub} | Organization: ${data.organizationId} | There was an error in executing add calendar event.\n Error Message: ${e.message}`,
        e.stack,
        ErrorCode.addCalendarEventError,
      );
      return new ErrorAddingCalendarEvent(data.organizationId, e?.message);
    }
  }

  public async getCalendarEvent(
    params: CalendarEventParamDto,
    user: User,
    query?: GetCalendarEventDto,
  ): Promise<CalendarEventDisplayModel | EcgError> {
    const { eventId } = params;
    try {
      this.logger.info(
        `User: ${user?.sub} | Calendar Event: ${eventId} | Executing get Calendar Event information from the system`,
      );

      const calendarEvent = await this._calendarEventRepository.getById(
        eventId,
        query,
      );

      if (calendarEvent instanceof NullCalendarEvent)
        return new ErrorCalendarEventNotFound(eventId);

      this.logger.info(
        `User: ${user?.sub} | Calendar Event: ${eventId} | Successfully gets the Calendar Event information.`,
      );

      return CalendarEventMapper.toDto(calendarEvent, query?.include);
    } catch (e) {
      this.logger.error(
        `User: ${user?.sub} | Calendar Event: ${eventId} | There was an error while executing get the calendar event information.\n Error Message: ${e.message}`,
        e.stack,
        ErrorCode.getCalendarEventError,
      );
      return new ErrorGetCalendarEvent(eventId, e.message);
    }
  }

  public async listEvents(
    params: CalendarEventListParamDto,
    query: ListCalendarEventDto,
    user: User,
  ): Promise<PagedCollection<CalendarEventDisplayModel> | EcgError> {
    const { organizationId } = params;
    try {
      this.logger.info(
        `User: ${user?.sub} | Organization: ${organizationId} | Executing list Calendar Events information`,
      );

      //---------------date range--------------
      let qDate = null;
      if (query?.dateRangeType) {
        const dateRangeType = query.dateRangeType;
        [qDate] = await calculateDateRange(dateRangeType, query);
      }

      const hierarchy = await this._orgRefRepository.getHierarchyIdsAndLevel(
        organizationId,
        hierarchyEnum.PARENT,
      );

      const [events, total] = await this._calendarEventRepository.list(
        organizationId,
        query,
        hierarchy?.map((o) => o?.org_id),
        qDate,
      );

      this.logger.info(
        `User: ${user?.sub} | Organization: ${organizationId} | Successfully executed list Calendar Events information.`,
      );

      return new PagedCollection<CalendarEventDisplayModel>(
        query?.skip,
        query?.take,
        total,
        CalendarEventMapper.toListDto(events, query?.include),
      );
    } catch (e) {
      this.logger.error(
        `User: ${user?.sub} | There was an error while executing list the calendar events information.\n Error Message: ${e.message}`,
        e.stack,
        ErrorCode.listCalendarEventError,
      );
      return new ErrorListCalendarEvent(organizationId, undefined, e?.message);
    }
  }
}
