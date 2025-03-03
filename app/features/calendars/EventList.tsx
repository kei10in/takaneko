import { Link } from "react-router";
import clsx from "clsx";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { CalendarEventItem } from "./CalendarEventItem";
import { CalendarEvent } from "./calendarEvents";
import { dateHref } from "./utils";

interface Props {
  calendarEvents: { date: NaiveDate; events: CalendarEvent[] }[];
  classNameForDate?: string;
}

export const EventList: React.FC<Props> = (props: Props) => {
  const { calendarEvents: events, classNameForDate } = props;

  return (
    <div className="pb-4">
      {events.map(({ date: dt, events: eventsInDate }) => {
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
