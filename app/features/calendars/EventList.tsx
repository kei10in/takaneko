import { clsx } from "clsx";
import { useMemo } from "react";
import { Link } from "react-router";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { CalendarEventItem } from "./CalendarEventItem";
import { CalendarEvent, sortedCalendarEvents } from "./calendarEvents";
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
    const firstCalendarDate = firstDate.addDays(-firstDate.dayOfWeek);
    const lastDate = NaiveDate.lastDateOfMonth(month);
    const lastCalendarDate = lastDate.addDays(6 - lastDate.dayOfWeek);

    // 表示するのは指定した月のカレンダーの範囲内のイベントのみ
    const filtered = events.filter((e) => {
      const eventDate = e.meta.date;
      return (
        eventDate.compareTo(firstCalendarDate) >= 0 && eventDate.compareTo(lastCalendarDate) <= 0
      );
    });

    return sortedCalendarEvents(filtered).reduce(
      (acc, event) => {
        if (acc.length == 0) {
          return [{ date: event.meta.date, events: [event] }];
        }

        const last = acc[acc.length - 1];
        if (last.date.equals(event.meta.date)) {
          return [...acc.slice(0, -1), { date: last.date, events: [...last.events, event] }];
        } else {
          return [...acc, { date: event.meta.date, events: [event] }];
        }
      },
      [] as { date: NaiveDate; events: CalendarEvent[] }[],
    );
  }, [events, month]);

  return (
    <div className="pb-4">
      {eventsByDate.map(({ date: dt, events: eventsInDate }) => {
        const anchor = dt.toString();
        const date = displayDate(dt);

        if (eventsInDate.length == 0) {
          return null;
        }

        return (
          <div key={dt.getTimeAsUTC()}>
            <div className={clsx("px-2 pt-4 text-lg font-bold", classNameForDate)} id={anchor}>
              <Link to={dateHref(dt)}>{date}</Link>
            </div>
            <div>
              {eventsInDate.map((event) => (
                <Link key={event.slug} to={`/events/${event.slug}`}>
                  <CalendarEventItem
                    category={event.meta.category}
                    summary={event.meta.summary}
                    location={event.meta.location}
                    region={event.meta.region}
                  />
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
