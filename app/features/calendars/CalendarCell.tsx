import { clsx } from "clsx";
import { eventTypeToColor } from "../events/EventType";
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
        "flex h-full w-full flex-col justify-start",
        selected && "overflow-hidden bg-blue-500 text-white",
      )}
    >
      <div
        className={clsx(
          "pt-px lg:pb-px",
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
            "mx-auto flex h-4.5 w-4.5 items-center justify-center rounded-full text-xs",
            "lg:h-5 lg:w-5 lg:text-sm",
            "data-today:bg-nadeshiko-900 data-today:text-white",
          )}
        >
          {date}
        </div>
      </div>

      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={clsx(
            "h-4.5 text-center text-xs leading-normal lg:block",
            "lg:h-5 lg:text-sm",
            index != 0 && "hidden",
            !currentMonth && "text-gray-300",
          )}
        >
          {regions[index]}
        </div>
      ))}

      <div className="mt-auto pt-px pb-1 lg:pt-1 lg:pb-1">
        {events.length <= 5 ? (
          <div className="flex h-1 items-center justify-center gap-0.5 lg:h-1.5 lg:gap-1">
            {events.map((event) => {
              const color = eventTypeToColor(event.category);
              return (
                <div
                  className={clsx("h-1 w-1 flex-none rounded-full", "lg:h-1.5 lg:w-1.5", color)}
                  key={event.slug}
                />
              );
            })}
          </div>
        ) : (
          <div className="mx-auto h-1 w-7 rounded-sm bg-nadeshiko-700" />
        )}
      </div>
    </div>
  );
};
