import { clsx } from "clsx";
import { useMemo } from "react";
import { Link } from "react-router";
import { displayDayOfWeek } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { CalendarEvent } from "./calendarEvents";
import { LinkCalendarEventItem } from "./LinkCalendarEventItem";
import { dateHref } from "./utils";

interface Props {
  events: CalendarEvent[];
  month: NaiveMonth;
  today: NaiveDate;
  classNameForDate?: string;
}

export const EventList: React.FC<Props> = (props: Props) => {
  const { events, month, today, classNameForDate } = props;

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

  if (eventsByDate.every(({ events }) => events.length === 0)) {
    return (
      <div className="flex flex-1 flex-col justify-center pb-12">
        <p className="text-center text-gray-500">イベントが予定されていません。</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {eventsByDate.map(({ date: dt, events: eventsInDate }) => {
        const anchor = dt.toString();
        const isToday = dt.equals(today);
        // const date = displayDate(dt);
        const date = `${dt.month}月${dt.day}日`;
        const dayOfWeek = displayDayOfWeek(dt);
        const key = dt.getTimeAsUTC();

        if (eventsInDate.length === 0) {
          // イベントがない日付はアンカーだけ置いておく
          // アンカーは today リンクとかで必要になっています。
          return <div key={key} id={anchor} className={classNameForDate} />;
        }

        return (
          <section key={key} id={anchor} className={classNameForDate}>
            <div data-today={isToday ? "true" : undefined} className="group space-y-2 py-5">
              <div className="flex items-center justify-between px-1">
                <h2 className={clsx("font-semibold", classNameForDate)}>
                  <Link to={dateHref(dt)} className="space-x-2">
                    <span className="text-xl">{date}</span>
                    <span className="text-base text-zinc-400">{dayOfWeek}曜</span>
                  </Link>
                </h2>
                {isToday && (
                  <div className="rounded-full bg-nadeshiko-200 px-2 text-nadeshiko-800">今日</div>
                )}
              </div>
              <div className="space-y-4">
                {eventsInDate.map((event) => (
                  <LinkCalendarEventItem
                    key={event.slug}
                    to={`/events/${event.slug}`}
                    event={event}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
