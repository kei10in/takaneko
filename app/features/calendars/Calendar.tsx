import { clsx } from "clsx";
import { HiArrowUp, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Link } from "react-router";
import { displayMonth } from "~/utils/dateDisplay";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { EventType } from "../events/EventType";
import { CalendarEvent } from "./calendarEvents";
import { EventList } from "./EventList";
import { MonthlyCalendar } from "./MonthlyCalendar";
import { MonthlyCalendarController } from "./MonthlyCalendarController";

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

  // スクロール位置の調整のために必要な値です。
  const weeksInMonth = month.weeksInMonth();

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
        <MonthlyCalendarController
          month={month}
          category={category}
          hash={hash}
          hrefToday={hrefToday}
          hrefPreviousMonth={hrefPreviousMonth}
          hrefNextMonth={hrefNextMonth}
        />
        <MonthlyCalendar month={month} events={events} />
      </div>

      <div className={clsx("px-4 lg:flex lg:w-96 lg:flex-none lg:flex-col")}>
        <div
          id="events-list"
          className={clsx(
            weeksInMonth == 5 && "scroll-mt-[21.375rem]",
            weeksInMonth == 6 && "scroll-mt-[24.175rem]",
            "lg:flex-1 lg:scroll-mt-[calc(var(--header-height)+3rem)]!",
          )}
        >
          <EventList
            month={month}
            events={events}
            classNameForDate={clsx(
              weeksInMonth == 5 && "scroll-mt-[21.375rem]",
              weeksInMonth == 6 && "scroll-mt-[24.175rem]",
              "lg:scroll-mt-[calc(var(--header-height)+3rem)]!",
            )}
          />
        </div>

        <div className="ml-auto w-fit lg:flex-0">
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
