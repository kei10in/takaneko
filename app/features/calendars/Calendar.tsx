import { useMemo, useRef } from "react";
import { useRem } from "~/hooks/useRem";
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

  const stickyRef = useRef<HTMLDivElement>(null);

  const rem = useRem();

  return (
    <div className="bg-white">
      <div
        className="sticky top-12 bg-white lg:top-[calc(var(--header-height)+3rem)]"
        ref={stickyRef}
      >
        <MonthlyCalendar
          calendarMonth={calendarMonth}
          year={year}
          month={month}
          hrefToday={hrefToday}
          hrefPreviousMonth={hrefPreviousMonth}
          hrefNextMonth={hrefNextMonth}
        />
      </div>

      <EventList
        calendarEvents={calendarEvents}
        scrollMargin={stickyRef.current ? stickyRef.current.clientHeight + 3 * rem : undefined}
      />
    </div>
  );
};
