import { Link } from "@remix-run/react";
import { toISODateString, toJapaneseDateString } from "./calendarDate";
import { CalendarEventItem } from "./CalendarEventItem";
import { CalendarEvent } from "./calendarEvents";

interface Props {
  events: Map<number, CalendarEvent[]>;
  scrollMargin?: number;
}

export const EventList: React.FC<Props> = (props: Props) => {
  const { events, scrollMargin } = props;

  const keys = [...events.keys()].toSorted();

  return (
    <div>
      {keys.map((d) => {
        const dt = new Date(d);
        const anchor = toISODateString(dt);
        const date = toJapaneseDateString(dt);
        const eventsInDate = events.get(d) ?? [];
        return (
          <div key={d}>
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
