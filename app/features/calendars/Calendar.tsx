import clsx from "clsx";
import { useMemo } from "react";
import { getCalendarDatesOfMonth } from "./calendarDate";
import { CalendarEvent, zipCalendarDatesAndEvents } from "./calendarEvents";
import { EventList } from "./EventList";
import { MonthlyCalendar } from "./MonthlyCalendar";

interface Props {
  events: CalendarEvent[];
  year: number;
  month: number;
  hrefToday: string;
  hrefPreviousMonth: string;
  hrefNextMonth: string;
}

export const Calendar: React.FC<Props> = (props: Props) => {
  const { events, year, month, hrefToday, hrefPreviousMonth, hrefNextMonth } = props;

  const dates = useMemo(() => getCalendarDatesOfMonth(year, month), [month, year]);
  const calendarMonth = useMemo(() => zipCalendarDatesAndEvents(dates, events), [dates, events]);
  const calendarEvents = useMemo(() => calendarMonth.flatMap((week) => week), [calendarMonth]);

  return (
    <div className="bg-white lg:min-h-[calc(100svh-var(--header-height)-3rem)]">
      <div className="sticky top-12 bg-white lg:static lg:top-auto lg:mr-96">
        <MonthlyCalendar
          calendarMonth={calendarMonth}
          year={year}
          month={month}
          hrefToday={hrefToday}
          hrefPreviousMonth={hrefPreviousMonth}
          hrefNextMonth={hrefNextMonth}
        />
      </div>

      <div
        data-weeks={calendarMonth.length.toString()}
        className={clsx(
          "group/events",
          "lg:fixed lg:bottom-0 lg:block lg:w-96 lg:overflow-y-auto lg:px-4",
          "lg:right-[max(0px,calc(50%-32rem))] lg:top-[calc(var(--header-height)+3rem)]",
          "xl:right-[max(0px,calc(50%-40rem))] 2xl:right-[max(0px,calc(50%-48rem))]",
        )}
      >
        <EventList
          calendarEvents={calendarEvents}
          classNameForDate={clsx(
            calendarMonth.length == 5 && "scroll-mt-[21.375rem]",
            calendarMonth.length == 6 && "scroll-mt-[24.175rem]",
            "lg:!scroll-mt-0",
          )}
        />
      </div>
    </div>
  );
};
