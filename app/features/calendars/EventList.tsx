import { Link } from "@remix-run/react";
import { toISODateString, toJapaneseDateString } from "./calendarDate";
import { CalendarEventItem } from "./CalendarEventItem";
import { CalendarEvent } from "./calendarEvents";
import { dateHref } from "./utils";

interface Props {
  calendarEvents: { date: Date; events: CalendarEvent[] }[];

  // カレンダーの下に配置されるとき用のスクロールマージン。
  // サイドに配置されるときの値はこのコンポーネント内で設定されています。
  scrollMargin?: number;
}

export const EventList: React.FC<Props> = (props: Props) => {
  const { calendarEvents: events, scrollMargin } = props;

  return (
    <div className="pb-4">
      {events.map(({ date: dt, events: eventsInDate }) => {
        const anchor = toISODateString(dt);
        const date = toJapaneseDateString(dt);

        if (eventsInDate.length == 0) {
          return null;
        }

        return (
          <div key={dt.getTime()}>
            <div
              className="px-2 pt-4 text-lg font-bold lg:!scroll-mt-0"
              id={anchor}
              style={{
                scrollMarginTop: scrollMargin,
              }}
            >
              <Link to={dateHref(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate())}>
                {date}
              </Link>
            </div>
            <div>
              {eventsInDate.map((event) => (
                <Link key={event.id} to={`/events/${event.id}`}>
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
        );
      })}
    </div>
  );
};
