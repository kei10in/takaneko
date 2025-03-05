import { clsx } from "clsx";
import { useMemo } from "react";
import { HiArrowUp, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Link } from "react-router";
import { displayMonth } from "~/utils/dateDisplay";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { getCalendarDatesOfMonth } from "../../utils/calendar/calendarDate";
import { EventType } from "../events/EventType";
import { CalendarEvent, zipCalendarDatesAndEvents } from "./calendarEvents";
import { EventList } from "./EventList";
import { MonthlyCalendar } from "./MonthlyCalendar";

interface Props {
  events: CalendarEvent[];
  month: NaiveMonth;
  category?: EventType | undefined;
  hash?: string | undefined;
  hrefToday: string;
  hrefPreviousMonth: string;
  hrefNextMonth: string;
}

export const Calendar: React.FC<Props> = (props: Props) => {
  const { events, month, category, hash = "", hrefToday, hrefPreviousMonth, hrefNextMonth } = props;

  const dates = useMemo(
    () => getCalendarDatesOfMonth(month.year, month.month),
    [month.year, month.month],
  );
  const calendarMonth = useMemo(() => zipCalendarDatesAndEvents(dates, events), [dates, events]);
  const calendarEvents = useMemo(() => calendarMonth.flatMap((week) => week), [calendarMonth]);

  const prevMonth = month.previousMonth();
  const nextMonth = month.nextMonth();

  return (
    <div className="bg-white pb-8 lg:flex lg:min-h-[calc(100svh-var(--header-height)-3rem)]">
      <div
        className={clsx(
          "sticky top-12 bg-white",
          "lg:top-[calc(var(--header-height)+3rem)]",
          "lg:h-fit lg:max-h-[calc(100svh-var(--header-height)-3rem)]",
          "lg:flex-1 lg:overflow-y-auto lg:pb-8",
        )}
      >
        <MonthlyCalendar
          calendarMonth={calendarMonth}
          month={month}
          category={category}
          hash={hash}
          hrefToday={hrefToday}
          hrefPreviousMonth={hrefPreviousMonth}
          hrefNextMonth={hrefNextMonth}
        />
      </div>

      <div className={clsx("px-4 lg:flex lg:w-96 lg:flex-none lg:flex-col")}>
        <div
          id="events-list"
          className={clsx(
            calendarMonth.length == 5 && "scroll-mt-[21.375rem]",
            calendarMonth.length == 6 && "scroll-mt-[24.175rem]",
            "lg:flex-1 lg:!scroll-mt-[calc(var(--header-height)+3rem)]",
          )}
        >
          <EventList
            calendarEvents={calendarEvents}
            classNameForDate={clsx(
              calendarMonth.length == 5 && "scroll-mt-[21.375rem]",
              calendarMonth.length == 6 && "scroll-mt-[24.175rem]",
              "lg:!scroll-mt-[calc(var(--header-height)+3rem)]",
            )}
          />
        </div>

        <div className="lg:flex-0 ml-auto w-fit">
          <Link
            to="#events-list"
            className="inline-flex items-center justify-center gap-1 text-sm text-gray-500"
          >
            <span>最初に戻る</span>
            <HiArrowUp className="w-3" />
          </Link>
        </div>

        <hr className="my-2 border-gray-300" />

        <div className="">
          <div className="flex items-center justify-between">
            <Link className="flex items-center font-bold text-gray-500" to={`${hrefPreviousMonth}`}>
              <span>
                <HiChevronLeft />
              </span>
              <span>{displayMonth(prevMonth)}</span>
            </Link>
            <Link className="flex items-center font-bold text-gray-500" to={`${hrefNextMonth}`}>
              <span>{displayMonth(nextMonth)}</span>
              <span>
                <HiChevronRight />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
