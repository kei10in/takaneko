import clsx from "clsx";
import { CalendarEvent, uniqueEventRegions } from "./calendarEvents";

interface Props {
  date: number;
  day: number;
  events: CalendarEvent[];
  currentMonth: boolean;
  today?: boolean;
  selected?: boolean;
}

export const CalendarCell: React.FC<Props> = (props: Props) => {
  const { date, day, events, currentMonth, today = false, selected = false } = props;

  const regions = uniqueEventRegions(events);

  const isSunday = day == 0;
  const isSaturday = day == 6;
  const isWeekday = !isSunday && !isSaturday;

  return (
    <div
      className={clsx(
        "h-11 w-full lg:h-[6.5rem]",
        selected && "overflow-hidden bg-blue-500 text-white",
      )}
    >
      <div
        className={clsx(
          "pt-px",
          currentMonth && isWeekday && "text-gray-800",
          currentMonth && isSunday && "text-red-500",
          currentMonth && isSaturday && "text-gray-800",
          !currentMonth && "text-gray-300",
          selected && "bg-blue-500 text-white",
        )}
      >
        <div
          data-today={today ? true : undefined}
          className={clsx(
            "mx-auto flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full text-sm",
            "data-[today]:bg-nadeshiko-900 data-[today]:text-white",
          )}
        >
          {date}
        </div>
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
      {regions[2] && (
        <div
          className={clsx("hidden text-center text-sm lg:block", !currentMonth && "text-gray-300")}
        >
          {regions[2]}
        </div>
      )}
      {regions[3] && (
        <div
          className={clsx("hidden text-center text-sm lg:block", !currentMonth && "text-gray-300")}
        >
          {regions[3]}
        </div>
      )}
    </div>
  );
};
