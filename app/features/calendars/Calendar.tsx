import { Link } from "@remix-run/react";
import { useMemo, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { CalendarCell } from "./CalendarCell";
import { getCalendarDatesOfMonth, toISODateString } from "./calendarDate";
import { CalendarEvent, zipCalendarDatesAndEvents } from "./calendarEvents";
import { EventList } from "./EventList";

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

  return (
    <div>
      <div
        className="sticky top-12 z-20 bg-white lg:top-[calc(var(--header-height)+3rem)]"
        ref={stickyRef}
      >
        <div className="mx-4 flex items-center justify-between py-2">
          <Link
            className="inline-flex h-8 w-24 items-center rounded-md border border-gray-200"
            to={hrefToday}
            preventScrollReset={true}
          >
            <span className="mx-auto">今日</span>
          </Link>
          <span className="text-gray-800">
            {year}年{month}月
          </span>
          <span className="inline-flex h-8 w-24 divide-x overflow-hidden rounded-md border border-gray-200">
            <Link
              className="inline-flex h-full flex-grow items-center justify-center"
              to={hrefPreviousMonth}
              preventScrollReset={true}
            >
              <HiChevronLeft />
            </Link>
            <Link
              className="inline-flex h-full flex-grow items-center justify-center"
              to={hrefNextMonth}
              preventScrollReset={true}
            >
              <HiChevronRight />
            </Link>
          </span>
        </div>
        <table className="w-full max-w-full table-fixed border-collapse border-none">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="w-[1/7] p-0">日</th>
              <th className="w-[1/7] p-0">月</th>
              <th className="w-[1/7] p-0">火</th>
              <th className="w-[1/7] p-0">水</th>
              <th className="w-[1/7] p-0">木</th>
              <th className="w-[1/7] p-0">金</th>
              <th className="w-[1/7] p-0">土</th>
            </tr>
          </thead>
          <tbody>
            {calendarMonth.map((week, i) => (
              <tr key={i} className="border-y border-gray-300">
                {week.map(({ date, events }, j) => {
                  const dateString = toISODateString(date);
                  return (
                    <td key={j} className="p-0">
                      {events.length == 0 ? (
                        <div className="w-full">
                          <CalendarCell
                            date={date.getUTCDate()}
                            day={date.getUTCDay()}
                            events={events}
                            currentMonth={date.getUTCMonth() + 1 == month}
                          />
                        </div>
                      ) : (
                        <Link className="block w-full" to={`#${dateString}`}>
                          <CalendarCell
                            date={date.getUTCDate()}
                            day={date.getUTCDay()}
                            events={events}
                            currentMonth={date.getUTCMonth() + 1 == month}
                          />
                        </Link>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EventList
        calendarEvents={calendarEvents}
        scrollMargin={stickyRef.current?.getBoundingClientRect().bottom}
      />
    </div>
  );
};
