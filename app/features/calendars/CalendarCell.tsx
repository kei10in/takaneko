import clsx from "clsx";
import { CalendarEvent, uniqueEventRegions } from "./calendarEvents";

interface Props {
  date: number;
  day: number;
  events: CalendarEvent[];
  currentMonth: boolean;
  selected?: boolean;
}

export const CalendarCell: React.FC<Props> = (props: Props) => {
  const { date, day, events, currentMonth, selected = false } = props;

  const regions = uniqueEventRegions(events);

  const isSunday = day == 0;
  const isSaturday = day == 6;
  const isWeekday = !isSunday && !isSaturday;

  return (
    <div className={clsx("h-11 w-full lg:h-16", selected && "bg-blue-500 text-white")}>
      <div
        className={clsx(
          "text-center text-sm",
          currentMonth && isWeekday && "text-gray-800",
          currentMonth && isSunday && "text-red-500",
          currentMonth && isSaturday && "text-gray-800",
          !currentMonth && "text-gray-300",
          selected && "bg-blue-500 text-white",
        )}
      >
        {date}
      </div>
      {regions[0] && (
        <div className={clsx("text-center text-sm", !currentMonth && "text-gray-300")}>
          {regions[0]}
        </div>
      )}
      {regions[1] && (
        <div
          className={clsx("hidden text-center text-sm lg:block", !currentMonth && "text-gray-300")}
        >
          {regions[1]}
        </div>
      )}
    </div>
  );
};
