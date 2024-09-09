import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  unstable_defineClientLoader as defineClientLoader,
  MetaFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { Calendar } from "~/features/calendars/Calendar";
import { convertEventModuleToCalendarEvent } from "~/features/calendars/calendarEvents";
import { calendarMonthHref, currentMonthHref, validateYearMonth } from "~/features/calendars/utils";
import { loadEvents } from "~/features/events/events";
import { displayMonth } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title =
    data == undefined ? "スケジュール" : `${displayMonth(data.year, data.month)} のスケジュール`;

  return [
    { title: formatTitle(title) },
    {
      name: "description",
      content:
        "高嶺のなでしこの出演予定やリリース情報をまとめた非公式スケジュールです。" +
        "気になるイベント・ライブ・テレビ・ラジオの出演日や雑誌・CDの発売日などを確認しましょう。",
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const r = validateYearMonth({ year: params.year, month: params.month });
  if (r == undefined) {
    throw new Response("", { status: 404 });
  }

  const { year, month } = r;
  return json({ year, month });
};

export const clientLoader = defineClientLoader(async ({ params }) => {
  const r = validateYearMonth({ year: params.year, month: params.month });
  if (r == undefined) {
    throw new Response("", { status: 404 });
  }

  const { year, month } = r;
  return json({ year, month });
});

export default function Index() {
  const { year, month } = useLoaderData<typeof loader>();

  const calendarEvents = useMemo(() => {
    const m = new NaiveMonth(year, month);
    const events = loadEvents(m);
    const calendarEvents = events.map(convertEventModuleToCalendarEvent);
    return calendarEvents;
  }, [month, year]);

  const m = new NaiveMonth(year, month);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const m = new NaiveMonth(year, month);
    const currentMonth = NaiveMonth.current();
    if (location.hash === "" && m.equals(currentMonth)) {
      const anchor = NaiveDate.todayInJapan().toString();
      navigate(`#${anchor}`, { replace: true });
    }
  }, [location.hash, month, navigate, year]);

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
