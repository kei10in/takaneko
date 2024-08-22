import { Link } from "@remix-run/react";
import { toISODateString, toJapaneseDateString } from "./calendarDate";
import { CalendarEventItem } from "./CalendarEventItem";
import { CalendarEvent } from "./calendarEvents";

interface Props {
  calendarEvents: { date: Date; events: CalendarEvent[] }[];
  scrollMargin?: number;
}

export const EventList: React.FC<Props> = (props: Props) => {
  const { calendarEvents: events, scrollMargin } = props;

  return (
    <div>
      {events.map(({ date: dt, events: eventsInDate }) => {
        const anchor = toISODateString(dt);
        const date = toJapaneseDateString(dt);

        if (eventsInDate.length == 0) {
          return null;
        }

        return (
          <div key={dt.getTime()}>
            <div
              className="px-2 pt-2"
              id={anchor}
              style={{
                scrollMarginTop: scrollMargin,
              }}
            >
              {date}
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
