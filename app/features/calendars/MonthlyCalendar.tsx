import { useMemo } from "react";
import { Link } from "react-router";
import { getCalendarDatesOfMonth } from "~/utils/calendar/calendarDate";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { CalendarCell } from "./CalendarCell";
import { CalendarEvent, zipCalendarDatesAndEvents } from "./calendarEvents";

interface Props {
  month: NaiveMonth;
  events: CalendarEvent[];
}

export const MonthlyCalendar: React.FC<Props> = (props: Props) => {
  const { month, events } = props;

  const dates = useMemo(
    () => getCalendarDatesOfMonth(month.year, month.month),
    [month.year, month.month],
  );
  const calendarMonth = useMemo(() => zipCalendarDatesAndEvents(dates, events), [dates, events]);

  return (
    <table className="w-full max-w-full table-fixed border-separate border-spacing-0 select-none">
      <thead>
        <tr className="text-xs text-gray-500 lg:text-sm">
          <th className="w-1/7 border-b border-gray-300 p-0">日</th>
          <th className="w-1/7 border-b border-gray-300 p-0">月</th>
          <th className="w-1/7 border-b border-gray-300 p-0">火</th>
          <th className="w-1/7 border-b border-gray-300 p-0">水</th>
          <th className="w-1/7 border-b border-gray-300 p-0">木</th>
          <th className="w-1/7 border-b border-gray-300 p-0">金</th>
          <th className="w-1/7 border-b border-gray-300 p-0">土</th>
        </tr>
      </thead>
      <tbody>
        {calendarMonth.map((week, i) => (
          <tr key={i} className="border-y border-gray-300">
            {week.map(({ date, events }, j) => {
              const dateString = date.toString();
              const currentMonth = date.naiveMonth().equals(month);
              return (
                <td key={j} className="border-b border-gray-300 p-0">
                  {events.length == 0 || !currentMonth ? (
                    <div className="w-full">
                      <CalendarCell
                        date={date.day}
                        day={date.dayOfWeek}
                        events={events}
                        currentMonth={currentMonth}
                        today={date.equals(NaiveDate.todayInJapan())}
                      />
                    </div>
                  ) : (
                    <Link
                      className="block w-full"
                      to={`#${dateString}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const elem = document.getElementById(`${dateString}`);
                        elem?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <CalendarCell
                        date={date.day}
                        day={date.dayOfWeek}
                        events={events}
                        currentMonth={currentMonth}
                        today={date.equals(NaiveDate.todayInJapan())}
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
  );
};
