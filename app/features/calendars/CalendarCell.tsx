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

/**
 * このコンポーネント自体の最小サイズが実質的に存在しています。
 * そのため、カレンダー自体の最小の高さは、このコンポーネントの最小の高さに依存します。
 */
export const CalendarCell: React.FC<Props> = (props: Props) => {
  const { date, day, events, currentMonth, today = false, selected = false } = props;

  const regions = uniqueEventRegions(events);

  const isSunday = day == 0;
  const isSaturday = day == 6;
  const isWeekday = !isSunday && !isSaturday;

  return (
    <div
      className={clsx(
        "@container-size/main flex h-full min-h-11.5 w-full flex-col justify-start overflow-hidden",
        selected && "overflow-hidden bg-blue-500 text-white",
      )}
    >
      <div
        className={clsx(
          "flex-none pt-px [@container_main_(height>=4.5rem)]:py-1",
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
            "[@container_main_(height>=3.5rem)]:size-5 [@container_main_(height>=3.5rem)]:text-sm",
            "data-today:bg-nadeshiko-900 data-today:text-white",
          )}
        >
          {date}
        </div>
      </div>

      <div className="@container-size/region flex-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={clsx(
              "h-4.5 text-center text-xs leading-normal",
              "[@container_main_(height>=3.5rem)]:h-5 [@container_main_(height>=3.5rem)]:text-sm",
              index == 0 && "block",
              index == 1 && "hidden [@container_region_(height>=2.5rem)]:block",
              index == 2 && "hidden [@container_region_(height>=3.75rem)]:block",
              !currentMonth && "text-gray-300",
            )}
          >
            {regions[index]}
          </div>
        ))}
      </div>

      <div className="flex-none pt-px pb-1 [@container_main_(height>=3.5rem)]:py-1">
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
