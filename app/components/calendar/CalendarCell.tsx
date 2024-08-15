import clsx from "clsx";
import { CalendarEvent } from "./event";

interface Props {
  date: number;
  day: number;
  events: CalendarEvent[];
  currentMonth: boolean;
  selected?: boolean;
}

export const CalendarCell: React.FC<Props> = (props: Props) => {
  const { date, day, events, currentMonth, selected = false } = props;

  const region = events.find((event) => event.region != undefined)?.region;

  const isSunday = day == 0;
  const isSaturday = day == 6;
  const isWeekday = !isSunday && !isSaturday;

  return (
    <div className={clsx("h-11 w-full", selected && "bg-blue-500 text-white")}>
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
      <div className={clsx("text-center text-sm", !currentMonth && "text-gray-300")}>{region}</div>
    </div>
  );
};
