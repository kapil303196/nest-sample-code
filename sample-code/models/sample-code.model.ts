import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { ActiveInfo, ArchiveInfo, AuditInfo } from "../../core/domain";
import { MediaInfoDto, ScheduleDetailDto } from "../../core/dto";
import { User } from "../../utils/auth/dto/user.dto";
import {
  assignmentTypeEnum,
  calendarEventTagEnum,
  localeEnum,
} from "../../utils/constants/enum.constant";
import { CalendarEventTranslationDto } from "../dto";

@Entity({
  schema: "calendar",
  name: "calendar_event",
})
export class CalendarEvent extends BaseEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  private readonly _id: string;

  @Column({ name: "organization_id", type: "uuid", nullable: false })
  private readonly _organizationId: string;

  @Column({ name: "title", type: "text" })
  private _title: string;

  @Column({ name: "description", type: "text" })
  private _description: string;

  @Column({ name: "locale", type: "text" })
  private readonly _locale: localeEnum;

  @Column({ name: "translations", type: "simple-json" })
  private _translations: CalendarEventTranslationDto[];

  @Column({ name: "media", type: "simple-json" })
  private _media: MediaInfoDto[];

  @Column({ name: "start_date_time", type: "timestamp without time zone" })
  private _startDateTime: Date;

  @Column({ name: "end_date_time", type: "timestamp without time zone" })
  private _endDateTime: Date;

  @Column({ name: "event_tags", type: "simple-json" })
  private _eventTags: calendarEventTagEnum[];

  @Column({ name: "metadata", type: "simple-json" })
  private _metadata: any;

  @Column({ name: "overridden_from_event_id", type: "uuid" })
  private _overriddenFromEventId: string;

  @Column({ name: "is_override", type: "boolean" })
  private _isOverride: boolean;

  @Column({ name: "overridden_time_slot", type: "timestamp without time zone" })
  private _overriddenTimeSlot: Date;

  @Column({ name: "recurring_configuration", type: "simple-json" })
  private _recurringConfiguration: ScheduleDetailDto;

  @Column({ name: "reminder_in_minutes_before_event" })
  private _reminderInMinutesBeforeEvent: number;

  @Column({ name: "assignment_type", type: "text" })
  private _assignmentType: assignmentTypeEnum;

  @Column(() => ActiveInfo, { prefix: false })
  private _activeInfo: ActiveInfo;

  @Column(() => AuditInfo, { prefix: false })
  private _auditInfo: AuditInfo;

  @Column(() => ArchiveInfo, { prefix: false })
  private _archiveInfo: ArchiveInfo;

  constructor(
    id: string,
    organizationId: string,
    title: string,
    description: string,
    locale: localeEnum,
    translations: CalendarEventTranslationDto[],
    media: MediaInfoDto[],
    startDateTime: Date,
    endDateTime: Date,
    eventTags: calendarEventTagEnum[],
    metadata: any,
    isOverride: boolean,
    overriddenFromEventId: string,
    overriddenTimeSlot: Date,
    recurringConfiguration: ScheduleDetailDto,
    reminderInMinutesBeforeEvent: number,
    assignmentType: assignmentTypeEnum,
    user: User
  ) {
    super();
    this._id = id;
    this._organizationId = organizationId;
    this._title = title;
    this._description = description;
    this._locale = locale;
    this._translations = translations ?? [];
    this._media = media;
    this._startDateTime = startDateTime;
    this._endDateTime = endDateTime;
    this._eventTags = eventTags;
    this._metadata = metadata;
    this._isOverride = isOverride;
    this._overriddenFromEventId = overriddenFromEventId;
    this._overriddenTimeSlot = overriddenTimeSlot;
    this._recurringConfiguration = recurringConfiguration;
    this._reminderInMinutesBeforeEvent = reminderInMinutesBeforeEvent;
    this._assignmentType = assignmentType;
    this._activeInfo = new ActiveInfo();
    this._archiveInfo = new ArchiveInfo();
    this._auditInfo = new AuditInfo(user?.sub);
  }

  update(
    title: string,
    description: string,
    startDateTime: Date,
    endDateTime: Date,
    metadata: any,
    recurringConfiguration: ScheduleDetailDto,
    overriddenFromEventId: string,
    overriddenTimeSlot: Date,
    reminderInMinutesBeforeEvent: number,
    user: User
  ) {
    this._title = title;
    this._description = description;
    this._startDateTime = startDateTime;
    this._endDateTime = endDateTime;
    this._metadata = metadata;
    this._overriddenFromEventId = overriddenFromEventId;
    this._overriddenTimeSlot = overriddenTimeSlot;
    this._recurringConfiguration = recurringConfiguration;
    this._reminderInMinutesBeforeEvent = reminderInMinutesBeforeEvent;
    this._auditInfo = this._auditInfo.setUpdated(user?.sub);
  }

  public get id(): string {
    return this._id;
  }

  public get organizationId(): string {
    return this._organizationId;
  }

  public get title(): string {
    return this._title;
  }

  public get description(): string {
    return this._description;
  }

  public get locale(): localeEnum {
    return this._locale;
  }

  public get translations(): CalendarEventTranslationDto[] {
    return this._translations;
  }

  public get media(): MediaInfoDto[] {
    return this._media;
  }

  public get startDateTime(): Date {
    return this._startDateTime;
  }

  public get endDateTime(): Date {
    return this._endDateTime;
  }

  public get eventTags(): calendarEventTagEnum[] {
    return this._eventTags;
  }

  public get metadata(): any {
    return this._metadata;
  }

  public get isOverride(): boolean {
    return this._isOverride;
  }

  public get overriddenFromEventId(): string {
    return this._overriddenFromEventId;
  }

  public get overriddenTimeSlot(): Date {
    return this._overriddenTimeSlot;
  }

  public get recurringConfiguration(): ScheduleDetailDto {
    return this._recurringConfiguration;
  }

  public get reminderInMinutesBeforeEvent(): number {
    return this._reminderInMinutesBeforeEvent;
  }

  public get assignmentType(): assignmentTypeEnum {
    return this._assignmentType;
  }

  public get activeInfo(): ActiveInfo {
    return this._activeInfo;
  }

  public get auditInfo(): AuditInfo {
    return this._auditInfo;
  }

  public get archiveInfo(): ArchiveInfo {
    return this._archiveInfo;
  }
}

export class NullCalendarEvent extends CalendarEvent {
  constructor() {
    super(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }
}
