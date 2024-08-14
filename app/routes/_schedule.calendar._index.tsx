import type { MetaFunction } from "@remix-run/node";
import { unstable_defineClientLoader as defineClientLoader, useLoaderData } from "@remix-run/react";
import { Calendar } from "~/components/calendar/Calendar";
import { SITE_TITLE } from "~/constants";
import { nextMonthHref, previousMonthHref, todayHref } from "~/features/calendars/utils";
import { EventModule, loadEvents } from "~/features/events/events";
import { convertEventModuleToCalendarEvent } from "~/features/events/meta";

export const meta: MetaFunction = () => {
  return [
    { title: `スケジュール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこの非公式スケジュールです。",
    },
  ];
};

export const clientLoader = defineClientLoader(
  async (): Promise<{ year: number; month: number; events: EventModule[] }> => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const events = await loadEvents({ year, month });
    return { year, month, events };
  },
);

export default function Index() {
  const { year, month, events } = useLoaderData<typeof clientLoader>();
  const calendarEvents = events.map(convertEventModuleToCalendarEvent);

  return (
    <div className="container mx-auto mt-4">
      <Calendar
        events={calendarEvents}
        year={year}
        month={month}
        hrefToday={todayHref()}
        hrefPreviousMonth={previousMonthHref(year, month)}
        hrefNextMonth={nextMonthHref(year, month)}
      />
    </div>
  );
}
