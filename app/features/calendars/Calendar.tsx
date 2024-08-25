import { Link } from "@remix-run/react";
import clsx from "clsx";
import { useMemo } from "react";
import { HiArrowUp, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { displayMonth } from "~/utils/dateDisplay";
import { getCalendarDatesOfMonth } from "./calendarDate";
import { CalendarEvent, zipCalendarDatesAndEvents } from "./calendarEvents";
import { EventList } from "./EventList";
import { MonthlyCalendar } from "./MonthlyCalendar";

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

  const dates = useMemo(() => getCalendarDatesOfMonth(year, month), [month, year]);
  const calendarMonth = useMemo(() => zipCalendarDatesAndEvents(dates, events), [dates, events]);
  const calendarEvents = useMemo(() => calendarMonth.flatMap((week) => week), [calendarMonth]);

  const prevMonth = new Date(Date.UTC(year, month - 2, 1));
  const nextMonth = new Date(Date.UTC(year, month, 1));

  return (
    <div className="bg-white lg:min-h-[calc(100svh-var(--header-height)-3rem)]">
      <div className="sticky top-12 bg-white lg:static lg:top-auto lg:mr-96">
        <MonthlyCalendar
          calendarMonth={calendarMonth}
          year={year}
          month={month}
          hrefToday={hrefToday}
          hrefPreviousMonth={`${hrefPreviousMonth}#events-list`}
          hrefNextMonth={`${hrefNextMonth}#events-list`}
        />
      </div>

      <div
        className={clsx(
          "px-4 lg:fixed lg:bottom-0 lg:block lg:w-96 lg:overflow-y-auto",
          "lg:right-[max(0px,calc(50%-32rem))] lg:top-[calc(var(--header-height)+3rem)]",
          "xl:right-[max(0px,calc(50%-40rem))] 2xl:right-[max(0px,calc(50%-48rem))]",
        )}
      >
        <div
          id="events-list"
          className={clsx(
            calendarMonth.length == 5 && "scroll-mt-[21.375rem]",
            calendarMonth.length == 6 && "scroll-mt-[24.175rem]",
            "lg:!scroll-mt-0",
          )}
        >
          <EventList
            calendarEvents={calendarEvents}
            classNameForDate={clsx(
              calendarMonth.length == 5 && "scroll-mt-[21.375rem]",
              calendarMonth.length == 6 && "scroll-mt-[24.175rem]",
              "lg:!scroll-mt-0",
            )}
          />
        </div>

        <div className="ml-auto w-fit">
          <Link
            to="#events-list"
            className="inline-flex items-center justify-center gap-1 text-sm text-gray-500"
          >
            <span>最初に戻る</span>
            <HiArrowUp className="w-3" />
          </Link>
        </div>

        <hr className="my-2" />

        <div className="pb-12">
          <div className="flex items-center justify-between">
            <Link
              className="flex items-center font-bold text-gray-500"
              to={`${hrefPreviousMonth}#events-list`}
            >
              <span>
                <HiChevronLeft />
              </span>
              <span>{displayMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth() + 1)}</span>
            </Link>
            <Link
              className="flex items-center font-bold text-gray-500"
              to={`${hrefNextMonth}#events-list`}
            >
              <span>{displayMonth(nextMonth.getUTCFullYear(), nextMonth.getUTCMonth() + 1)}</span>
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
