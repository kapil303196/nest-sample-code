import MockDate from "mockdate";
import {
  CalendarEvent,
  NullCalendarEvent,
} from "../../src/calendar-events/models/calendar-event.model";
import { mockUser } from "../../src/utils/mock/mock-dependencies";
import {
  assignmentTypeEnum,
  calendarEventTagEnum,
  frequencyEnum,
  localeEnum,
  weekdayWordEnum,
} from "../../src/utils/constants/enum.constant";

MockDate.set("2024-01-01T00:00:00.000Z");
describe("calendar-event-dto tests", function () {
  test("calendar-event-dto constructor should pass", function () {
    const obj = new CalendarEvent(
      "uuid",
      "organizationId",
      "Calendar Event",
      "This is a calendar event",
      localeEnum.EN_US,
      [
        {
          locale: localeEnum.ES_US,
          title: "Spanish Title",
          description: "Spanish Description",
        },
      ],
      [
        {
          locale: localeEnum.EN_US,
          audioUrl: "https....",
          ssmlUrl: "https....",
        },
        {
          locale: localeEnum.ES_US,
          audioUrl: "https....",
          ssmlUrl: "https....",
        },
      ],
      new Date("2024-02-26T11:02:11.683Z"),
      new Date("2024-02-27T11:02:11.683Z"),
      [calendarEventTagEnum.DYNAMIC],
      {
        metadata: {
          Key1: "Value1",
          Key2: "Value2",
        },
      },
      true,
      "overriddenFromEventId",
      new Date(),
      {
        frequency: frequencyEnum.DAILY,
        interval: 1,
        time: "14:00",
        weekdays: [weekdayWordEnum.SAT],
        months: [12],
        daysOfMonth: [31],
      },
      15,
      assignmentTypeEnum.SPECIFIC_SUBSCRIBER,
      mockUser,
    );

    expect(obj).toEqual({
      _id: "uuid",
      _organizationId: "organizationId",
      _title: "Calendar Event",
      _description: "This is a calendar event",
      _locale: "en-US",
      _translations: [
        {
          locale: "es-US",
          title: "Spanish Title",
          description: "Spanish Description",
        },
      ],
      _media: [
        { locale: "en-US", audioUrl: "https....", ssmlUrl: "https...." },
        { locale: "es-US", audioUrl: "https....", ssmlUrl: "https...." },
      ],
      _startDateTime: new Date("2024-02-26T11:02:11.683Z"),
      _endDateTime: new Date("2024-02-27T11:02:11.683Z"),
      _eventTags: ["Dynamic"],
      _metadata: { metadata: { Key1: "Value1", Key2: "Value2" } },
      _overriddenFromEventId: "overriddenFromEventId",
      _isOverride: true,
      _overriddenTimeSlot: new Date("2024-01-01T00:00:00.000Z"),
      _recurringConfiguration: {
        frequency: "daily",
        interval: 1,
        time: "14:00",
        weekdays: ["sat"],
        months: [12],
        daysOfMonth: [31],
      },
      _reminderInMinutesBeforeEvent: 15,
      _assignmentType: "specific-subscriber",
      _activeInfo: { _active: true, _activeStatusChangedAt: null },
      _archiveInfo: { _archived: false, _archivedStatusChangedAt: null },
      _auditInfo: {
        _createdBy: "f227744a-7cb5-49c9-857e-1dadfcdba8fc",
        _updatedBy: "f227744a-7cb5-49c9-857e-1dadfcdba8fc",
        _createdAt: new Date("2024-01-01T00:00:00.000Z"),
        _updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
    });
  });

  test("null-calendar-event method should pass", function () {
    const obj = new NullCalendarEvent();

    expect(obj).toEqual({
      _id: null,
      _organizationId: null,
      _title: null,
      _description: null,
      _locale: null,
      _translations: [],
      _media: null,
      _startDateTime: null,
      _endDateTime: null,
      _eventTags: null,
      _metadata: null,
      _isOverride: null,
      _overriddenFromEventId: null,
      _overriddenTimeSlot: null,
      _recurringConfiguration: null,
      _reminderInMinutesBeforeEvent: null,
      _assignmentType: null,
      _activeInfo: { _active: true, _activeStatusChangedAt: null },
      _archiveInfo: { _archived: false, _archivedStatusChangedAt: null },
      _auditInfo: {
        _createdAt: new Date("2024-01-01T00:00:00.000Z"),
        _updatedAt: new Date("2024-01-01T00:00:00.000Z"),
        _updatedBy: null,
        _createdBy: null,
      },
    });
  });
});
