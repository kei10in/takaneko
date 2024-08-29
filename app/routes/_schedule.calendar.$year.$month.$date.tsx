import {
  unstable_defineClientLoader as defineClientLoader,
  Link,
  MetaFunction,
  useLoaderData,
} from "@remix-run/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { SITE_TITLE } from "~/constants";
import { CalendarEventItem } from "~/features/calendars/CalendarEventItem";
import { convertEventModuleToCalendarEvent } from "~/features/calendars/calendarEvents";
import { dateHref, validateYearMonthDate } from "~/features/calendars/utils";
import { loadEventsInDay } from "~/features/events/events";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

export const meta: MetaFunction = () => {
  return [
    { title: `スケジュール (β) - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこの非公式スケジュールです。",
    },
  ];
};

export const clientLoader = defineClientLoader(async ({ params }) => {
  const r = validateYearMonthDate({ year: params.year, month: params.month, date: params.date });
  if (r == undefined) {
    throw new Response("", { status: 404 });
  }

  const { year, month, date } = r;
  const events = await loadEventsInDay(new NaiveDate(year, month, date));
  return { year, month, date, events };
});

export default function Index() {
  const { year, month, date, events } = useLoaderData<typeof clientLoader>();
  const calendarEvents = events.map(convertEventModuleToCalendarEvent);
  const d = new NaiveDate(year, month, date);

  return (
    <div className="container mx-auto min-h-[calc(100svh-var(--header-height)-3rem)] p-4">
      <div className="mx-auto max-w-2xl space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="px-2 text-lg font-bold">{displayDateWithDayOfWeek(d)}</h1>
          <div className="flex h-8 w-36 items-stretch divide-x overflow-hidden rounded-md border border-gray-200">
            <Link
              className="inline-flex h-full flex-grow items-center justify-center"
              to={dateHref(d.previousDate())}
              preventScrollReset={true}
            >
              <HiChevronLeft />
            </Link>
            <Link
              className="inline-flex h-full flex-grow items-center justify-center"
              to="/calendar/today"
              preventScrollReset={true}
            >
              今日
            </Link>
            <Link
              className="inline-flex h-full flex-grow items-center justify-center"
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
              <Link key={event.id} to={`/events/${event.id}`}>
                <CalendarEventItem
                  category={event.category}
                  summary={event.summary}
                  location={event.location}
                  region={event.region}
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
}
