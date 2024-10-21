export const mockSubscriberId = uuid();
export const mockOrganizationId = uuid();
export const mockEventId = uuid();

export const mockParams = {
  eventId: mockEventId,
};

export const calendarEventParamDto: CalendarEventParamDto = {
  eventId: "181487ee-e5a5-4bd6-b7ed-fd8fcd7a5628",
};

export const mockAddCalendarEventItemsDto1: CalendarEventTranslationItemsDto = {
  items: [
    {
      title: "Título del evento",
      description: "Descripción detallada del evento.",
      locale: localeEnum.ES_US,
    },
  ],
};

export const mockAddCalendarEventItemsDto2: CalendarEventTranslationItemsDto = {
  items: [
    {
      title: "Event Title",
      description: "Detailed description of the event",
      locale: localeEnum.EN_US,
    },
  ],
};

export const mockUpdateCalendarEventItemsDto1: CalendarEventTranslationItemsDto =
  {
    items: [
      {
        title: "Título",
        description: "Descripción",
        locale: localeEnum.ES_US,
      },
    ],
  };

export const mockUpdateCalendarEventItemsDto2: CalendarEventTranslationItemsDto =
  {
    items: [
      {
        title: "Veranstaltungstitel",
        description: "Detaillierte Beschreibung der Veranstaltung",
        locale: localeEnum.DE_DE,
      },
    ],
  };

export const mockRecurringConfig: ScheduleDetailDto = {
  time: "14:00",
  months: [1],
  interval: 1,
  weekdays: [weekdayWordEnum.MON],
  frequency: frequencyEnum.DAILY,
  daysOfMonth: [1],
};

export const mockCalendarEvent1: CalendarEvent = CalendarEventMapper.toDomain(
  {
    organizationId: mockOrganizationId,
    title: "Event Title",
    description: "Detailed description of the event",
    locale: localeEnum.EN_US,
    startDateTime: new Date(),
    endDateTime: new Date(),
    eventTags: [calendarEventTagEnum.DYNAMIC],
    metadata: { key: "value" },
    recurringConfiguration: mockRecurringConfig,
    reminderInMinutesBeforeEvent: 15,
    assignmentType: assignmentTypeEnum.SPECIFIC_SUBSCRIBER,
    includeSubscriberIds: [mockSubscriberId],
  },
  mockUser
);

export const nullCalendarEvent = new NullCalendarEvent();

export const mockPerson = new PersonRef(
  uuid(),
  "1",
  "Jest",
  "Test",
  uuid(),
  mockOrganizationId,
  true,
  null,
  "string",
  localeEnum.EN_US,
  "Africa/Abidjan",
  "Male"
);

export const mockNullPerson = new NullPersonRef();

export const addCalendarEventDto: AddCalendarEventDto = {
  organizationId: "9f3c2c98-f921-439f-9641-80edce93950b",
  title: "Event Title",
  description: "Detailed description of the event",
  locale: localeEnum.EN_US,
  startDateTime: new Date("2024-02-26T12:49:29.983Z"),
  endDateTime: new Date("2024-02-26T12:49:29.983Z"),
  eventTags: [calendarEventTagEnum.DYNAMIC],
  metadata: {
    key: "value",
  },
  recurringConfiguration: {
    frequency: frequencyEnum.DAILY,
    interval: 1,
    time: "14:00",
    weekdays: [weekdayWordEnum.FRI],
    months: [1],
    daysOfMonth: [1],
  },
  reminderInMinutesBeforeEvent: 15,
  assignmentType: assignmentTypeEnum.SPECIFIC_SUBSCRIBER,
  includeSubscriberIds: [mockPerson.id],
};

export const mockUpdateBody = {
  items: [
    {
      value: "event title 1",
      path: "/title",
      op: "replace",
    },
  ],
};

export const mockHierarchy = [
  {
    org_id: mockOrganizationId,
    parent_org_id: uuid(),
    level: 1,
  },
];

export const nullEventRecipientMapping = new NullEventRecipientMapping();

export const subscriberOrgParamDto: SubscriberOrgParamDto = {
  subscriberId: mockSubscriberId,
  organizationId: mockOrganizationId,
};
