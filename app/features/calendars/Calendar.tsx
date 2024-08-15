import { Link } from "@remix-run/react";
import { useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { CalendarCell } from "./CalendarCell";
import { getCalendarDatesOfMonth, toISODateString, toJapaneseDateString } from "./calendarDate";
import { CalendarEventItem } from "./CalendarEventItem";
import { CalendarEvent, groupEventsByDate } from "./calendarEvents";

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

  const dates = getCalendarDatesOfMonth(year, month);

  const eventsInCurrentMonth = events.filter((event) => {
    const start = dates[0][0].getTime();
    const end = dates[dates.length - 1][dates[dates.length - 1].length - 1].getTime();
    return start <= event.date && event.date <= end;
  });
  const groupedEvents = groupEventsByDate(eventsInCurrentMonth);
  const keys = [...groupedEvents.keys()].toSorted();

  const stickyRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="sticky top-0 bg-white" ref={stickyRef}>
        <div className="mx-4 flex items-center justify-between py-2">
          <Link className="flex items-center rounded border border-gray-200 px-2" to={hrefToday}>
            <p className="h-6">今日</p>
          </Link>
          <p className="text-gray-800">
            {year}年{month}月
          </p>
          <div className="flex items-center justify-center divide-x overflow-hidden rounded border border-gray-200">
            <Link className="px-2" to={hrefPreviousMonth}>
              <HiChevronLeft className="h-6" />
            </Link>
            <Link className="px-2" to={hrefNextMonth}>
              <HiChevronRight className="h-6" />
            </Link>
          </div>
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
            {dates.map((week, i) => (
              <tr key={i} className="border-y border-gray-300">
                {week.map((date, j) => {
                  const dateString = toISODateString(date);
                  const utcDate = Date.UTC(
                    date.getUTCFullYear(),
                    date.getUTCMonth(),
                    date.getUTCDate(),
                  );
                  const events = groupedEvents.get(utcDate) ?? [];
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

      <div>
        {keys.map((d) => {
          const dt = new Date(d);
          const anchor = toISODateString(dt);
          const date = toJapaneseDateString(dt);
          const events = groupedEvents.get(d) ?? [];
          return (
            <div key={d}>
              <div
                className="px-2 pt-2"
                id={anchor}
                style={{ scrollMarginTop: stickyRef.current?.clientHeight }}
              >
                {date}
              </div>
              <div>
                {events.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`}>
                    <CalendarEventItem
                      category={event.category}
                      summary={event.summary}
                      location={event.location}
                    />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
