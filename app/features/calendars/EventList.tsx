import { Link } from "@remix-run/react";
import clsx from "clsx";
import { toISODateString, toJapaneseDateString } from "./calendarDate";
import { CalendarEventItem } from "./CalendarEventItem";
import { CalendarEvent } from "./calendarEvents";
import { dateHref } from "./utils";

interface Props {
  calendarEvents: { date: Date; events: CalendarEvent[] }[];
  classNameForDate?: string;
}

export const EventList: React.FC<Props> = (props: Props) => {
  const { calendarEvents: events, classNameForDate } = props;

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
            <div className={clsx("px-2 pt-4 text-lg font-bold", classNameForDate)} id={anchor}>
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
