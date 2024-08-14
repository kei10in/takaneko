import type { MetaFunction } from "@remix-run/node";
import { unstable_defineClientLoader as defineClientLoader, useLoaderData } from "@remix-run/react";
import { Calendar } from "~/components/calendar/Calendar";
import { SITE_TITLE } from "~/constants";
import {
  convertEventModuleToCalendarEvent,
  nextMonthHref,
  previousMonthHref,
  todayHref,
  validateYearMonth,
} from "~/features/calendars/utils";
import { EventModule, loadEvents } from "~/features/events/events";

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
  async ({ params }): Promise<{ year: number; month: number; events: EventModule[] }> => {
    const r = validateYearMonth({ year: params.year, month: params.month });
    if (r == undefined) {
      throw new Response("", { status: 404 });
    }

    const { year, month } = r;
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
