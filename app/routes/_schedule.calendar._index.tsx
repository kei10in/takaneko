import {
  unstable_defineClientLoader as defineClientLoader,
  MetaFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useEffect } from "react";
import { SITE_TITLE } from "~/constants";
import { Calendar } from "~/features/calendars/Calendar";
import { convertEventModuleToCalendarEvent } from "~/features/calendars/calendarEvents";
import { currentMonthHref, nextMonthHref, previousMonthHref } from "~/features/calendars/utils";
import { EventModule, loadEvents } from "~/features/events/events";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

export const meta: MetaFunction = () => {
  return [
    { title: `スケジュール (β)- ${SITE_TITLE}` },
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === "") {
      const anchor = NaiveDate.today().toString();
      navigate(`#${anchor}`);
    }
  }, [location.hash, navigate]);

  const { year, month, events } = useLoaderData<typeof clientLoader>();
  const calendarEvents = events.map(convertEventModuleToCalendarEvent);

  return (
    <div className="container mx-auto">
      <Calendar
        events={calendarEvents}
        year={year}
        month={month}
        hrefToday={currentMonthHref()}
        hrefPreviousMonth={previousMonthHref(year, month)}
        hrefNextMonth={nextMonthHref(year, month)}
      />
    </div>
  );
}
