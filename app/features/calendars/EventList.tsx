import { clsx } from "clsx";
import { useMemo } from "react";
import { Link } from "react-router";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { CalendarEventItem } from "./CalendarEventItem";
import { CalendarEvent } from "./calendarEvents";
import { dateHref } from "./utils";

interface Props {
  month: NaiveMonth;
  events: CalendarEvent[];
  classNameForDate?: string;
}

export const EventList: React.FC<Props> = (props: Props) => {
  const { month, events, classNameForDate } = props;

  const eventsByDate = useMemo(() => {
    const firstDate = NaiveDate.firstDateOfMonth(month);
    const lastDate = NaiveDate.firstDateOfMonth(month.nextMonth());

    const dates = Array.from({ length: lastDate.differenceInDays(firstDate) }, (_, i) => {
      return firstDate.addDays(i);
    });

    // 表示するのは指定した月のイベントのみ
    const monthString = month.toString();
    let xs = events.filter((e) => {
      return e.date.startsWith(monthString);
    });

    const result = dates.map((date) => {
      const dateString = date.toString();
      const i = xs.findIndex((e) => e.date != dateString);
      const events = xs.slice(0, i == -1 ? xs.length : i);
      xs = xs.slice(i);
      return { date, events };
    });

    return result;
  }, [events, month]);

  return (
    <div className="pb-4">
      {eventsByDate.map(({ date: dt, events: eventsInDate }) => {
        const anchor = dt.toString();
        const date = displayDate(dt);

        return (
          <div key={dt.getTimeAsUTC()} id={anchor} className={classNameForDate}>
            {/* イベントがない日を表示しないための要素。
            `overflow-hidden` な要素は `id` が付いている要素の子要素にしないと
            Chrome でのスクロールが期待通りにならない。*/}
            <div className={clsx("overflow-hidden", eventsInDate.length == 0 && "h-0")}>
              <div className={clsx("px-2 pt-4 text-lg font-bold", classNameForDate)}>
                <Link to={dateHref(dt)}>{date}</Link>
              </div>
              <div>
                {eventsInDate.map((event) => (
                  <Link key={event.slug} to={`/events/${event.slug}`}>
                    <CalendarEventItem
                      category={event.category}
                      summary={event.summary}
                      location={event.location}
                      region={event.region}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
