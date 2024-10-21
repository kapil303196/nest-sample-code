import { Test, TestingModule } from "@nestjs/testing";
import { LoggerModule } from "../../../src/utils/logger/logger.module";

describe("Calender Event Service", () => {
  let calendarEventService: CalendarEventService;
  let calendarEventRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        CalendarEventService,
        CalendarEventOverrideHelper,
        {
          provide: EventEmitter2,
          useFactory: mockEventEmitter,
        },
        {
          provide: CalendarEventRepository,
          useFactory: mockCalendarEventRepository,
        },
      ],
    }).compile();

    calendarEventService =
      module.get<CalendarEventService>(CalendarEventService);
  });

  describe("/POST Adds the Calendar Event => ", () => {
    it("should add the Calendar Event information successfully.", async () => {
      personRefRepository.getIds.mockReturnValue([mockPerson]);
      const result = (await calendarEventService.addCalendarEvent(
        addCalendarEventDto,
        mockUser
      )) as CalendarEventDisplayModel;

      expect(result).toBeInstanceOf(CalendarEventDisplayModel);
    });

    it("should return Error: ERR_CALENDAR_EVENT_ADD", async () => {
      personRefRepository.getIds.mockReturnValue([mockPerson]);
      calendarEventRepository.createTransaction.mockRejectedValue(fakeError);

      const result = await calendarEventService.addCalendarEvent(
        addCalendarEventDto,
        mockUser
      );

      expect(result).toBeInstanceOf(EcgError);
      if (result instanceof EcgError) {
        expect(result.category).toEqual(ErrorCategories.CalendarEvent);
        expect(result.code).toEqual(ErrorCode.addCalendarEventError);
      }
    });

    it("should return Error: ERR_PERSON_NOT_FOUND", async () => {
      personRefRepository.getIds.mockReturnValue([]);

      const result = await calendarEventService.addCalendarEvent(
        addCalendarEventDto,
        mockUser
      );

      expect(result).toBeInstanceOf(EcgError);
      if (result instanceof EcgError) {
        expect(result.category).toEqual(ErrorCategories.Person);
        expect(result.code).toEqual("ERR_PERSON_NOT_FOUND");
      }
    });
  });
});
