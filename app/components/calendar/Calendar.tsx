import { Link } from "@remix-run/react";
import { useRef, useState } from "react";
import { HiCalendar, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { CalendarCell } from "./CalendarCell";
import { CalendarEvent, groupEventsByDate } from "./event";
import {
  dateToYearMonth,
  getCalendarDatesOfMonth,
  toISODateString,
  toJapaneseDateString,
} from "./utils";

interface Props {
  events: CalendarEvent[];
  year: number;
  month: number;
  date: number;
}

export const Calendar: React.FC<Props> = (props: Props) => {
  const { events, year: y, month: m } = props;
  const [current, setCurrent] = useState({ year: y, month: m });

  const handleClickToday = () => {
    const date = new Date();
    setCurrent(dateToYearMonth(date));
  };

  const handleNextMonth = () => {
    const date = new Date(Date.UTC(current.year, current.month - 1 + 1, 1));
    setCurrent(dateToYearMonth(date));
  };

  const handlePrevMonth = () => {
    const date = new Date(Date.UTC(current.year, current.month - 1 - 1, 1));
    setCurrent(dateToYearMonth(date));
  };

  const year = current.year;
  const month = current.month;
  const dates = getCalendarDatesOfMonth(year, month);

  const eventsInCurrentMonth = events.filter((event) => {
    const date = new Date(event.date);
    return date.getUTCFullYear() == year && date.getUTCMonth() + 1 == month;
  });
  const groupedEvents = groupEventsByDate(eventsInCurrentMonth);
  const keys = [...groupedEvents.keys()].toSorted();

  const stickyRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="sticky top-0 bg-white" ref={stickyRef}>
        <div className="mx-4 flex items-center justify-between py-2">
          <div>
            <button className="rounded border border-gray-200 px-2" onClick={handleClickToday}>
              今日
            </button>
          </div>
          <p className="text-gray-800">
            {year}年{month}月
          </p>
          <div className="flex items-center justify-center divide-x overflow-hidden rounded border border-gray-200">
            <button className="block px-2" onClick={handlePrevMonth}>
              <HiChevronLeft className="h-6" />
            </button>
            <button className="block px-2" onClick={handleNextMonth}>
              <HiChevronRight className="h-6" />
            </button>
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
                    <div className="flex items-stretch gap-2 p-2">
                      <div className="w-1 rounded-full bg-blue-500" />
                      <div>
                        <p>{event.summary}</p>
                        <p className="text-gray-400">
                          <span className="mr-1">
                            <HiCalendar className="inline" />
                          </span>
                          {date}
                        </p>
                      </div>
                    </div>
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
