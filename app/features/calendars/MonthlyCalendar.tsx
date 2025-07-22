import { Link } from "react-router";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { CalendarCell } from "./CalendarCell";
import { CalendarEvent } from "./calendarEvents";

interface Props {
  calendarMonth: { date: NaiveDate; events: CalendarEvent[] }[][];
  month: NaiveMonth;
}

export const MonthlyCalendar: React.FC<Props> = (props: Props) => {
  const { calendarMonth, month } = props;

  return (
    <table className="w-full max-w-full table-fixed border-collapse border-none">
      <thead>
        <tr className="text-xs text-gray-500 lg:text-sm">
          <th className="w-1/7 p-0">日</th>
          <th className="w-1/7 p-0">月</th>
          <th className="w-1/7 p-0">火</th>
          <th className="w-1/7 p-0">水</th>
          <th className="w-1/7 p-0">木</th>
          <th className="w-1/7 p-0">金</th>
          <th className="w-1/7 p-0">土</th>
        </tr>
      </thead>
      <tbody>
        {calendarMonth.map((week, i) => (
          <tr key={i} className="border-y border-gray-300">
            {week.map(({ date, events }, j) => {
              const dateString = date.toString();
              return (
                <td key={j} className="p-0">
                  {events.length == 0 ? (
                    <div className="w-full">
                      <CalendarCell
                        date={date.day}
                        day={date.dayOfWeek}
                        events={events}
                        currentMonth={date.naiveMonth().equals(month)}
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
                        currentMonth={date.naiveMonth().equals(month)}
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
