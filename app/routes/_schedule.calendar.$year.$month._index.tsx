import {
  unstable_defineClientLoader as defineClientLoader,
  MetaFunction,
  useLoaderData,
} from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { Calendar } from "~/features/calendars/Calendar";
import { convertEventModuleToCalendarEvent } from "~/features/calendars/calendarEvents";
import { calendarMonthHref, currentMonthHref, validateYearMonth } from "~/features/calendars/utils";
import { EventModule, loadEvents } from "~/features/events/events";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";

export const meta: MetaFunction = () => {
  return [
    { title: `スケジュール (β) - ${SITE_TITLE}` },
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
    const events = await loadEvents(new NaiveMonth(year, month));
    return { year, month, events };
  },
);

export default function Index() {
  const { year, month, events } = useLoaderData<typeof clientLoader>();
  const m = new NaiveMonth(year, month);
  const calendarEvents = events.map(convertEventModuleToCalendarEvent);

  return (
    <div className="container mx-auto">
      <Calendar
        events={calendarEvents}
        month={m}
        hrefToday={currentMonthHref()}
        hrefPreviousMonth={calendarMonthHref(m.previousMonth())}
        hrefNextMonth={calendarMonthHref(m.nextMonth())}
      />
    </div>
  );
}
