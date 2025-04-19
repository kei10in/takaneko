import { useMemo } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Link } from "react-router";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { loadEventsInDay } from "../events/events";
import { CalendarEventItem } from "./CalendarEventItem";
import { dateHref } from "./utils";

interface Props {
  year: number;
  month: number;
  day: number;
}

export const DailyCalendar: React.FC<Props> = (props: Props) => {
  const { year, month, day } = props;

  const calendarEvents = useMemo(() => {
    const events = loadEventsInDay(new NaiveDate(year, month, day));
    return events;
  }, [day, month, year]);

  const d = new NaiveDate(year, month, day);

  return (
    <div className="container mx-auto min-h-[calc(100svh-var(--header-height)-3rem)] p-4">
      <div className="mx-auto max-w-2xl space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="px-2 text-lg font-bold">{displayDateWithDayOfWeek(d)}</h1>
          <div className="flex h-8 w-36 items-stretch divide-x divide-gray-200 overflow-hidden rounded-md border border-gray-200">
            <Link
              className="inline-flex h-full grow items-center justify-center"
              to={dateHref(d.previousDate())}
              preventScrollReset={true}
            >
              <HiChevronLeft />
            </Link>
            <Link
              className="inline-flex h-full grow items-center justify-center"
              to="/calendar/today"
              preventScrollReset={true}
            >
              今日
            </Link>
            <Link
              className="inline-flex h-full grow items-center justify-center"
              to={dateHref(d.nextDate())}
              preventScrollReset={true}
            >
              <HiChevronRight />
            </Link>
          </div>
        </div>
        <div>
          {calendarEvents.length !== 0 ? (
            calendarEvents.map((event) => (
              <Link key={event.slug} to={`/events/${event.slug}`}>
                <CalendarEventItem
                  category={event.meta.category}
                  summary={event.meta.summary}
                  location={event.meta.location}
                  region={event.meta.region}
                />
              </Link>
            ))
          ) : (
            <div className="mx-auto w-fit px-2 py-4 text-gray-800">予定はありません。</div>
          )}
        </div>
      </div>
    </div>
  );
};
