import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, MetaFunction, useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { DOMAIN } from "~/constants";
import { Calendar } from "~/features/calendars/Calendar";
import { convertEventModuleToCalendarEvent } from "~/features/calendars/calendarEvents";
import { calendarMonthHref, currentMonthHref } from "~/features/calendars/utils";
import { loadEvents } from "~/features/events/events";
import { parseCategory } from "~/features/events/EventType";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const canonical =
    data == undefined
      ? undefined
      : `https://${DOMAIN}${calendarMonthHref(new NaiveMonth(data.year, data.month))}`;

  return [
    { title: formatTitle("今月のスケジュール") },
    {
      name: "description",
      content:
        "高嶺のなでしこの出演予定やリリース情報をまとめた非公式スケジュールです。" +
        "今月の気になるイベント・ライブ・テレビ・ラジオの出演日や雑誌・CDの発売日などを確認しましょう。",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: canonical,
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const t = url.searchParams.get("t");
  const category = parseCategory(t);

  const currentMonth = NaiveMonth.current();
  return json({ year: currentMonth.year, month: currentMonth.month, category });
};

export default function Index() {
  const { year, month, category } = useLoaderData<typeof loader>();

  const calendarEvents = useMemo(() => {
    const m = new NaiveMonth(year, month);
    const events = loadEvents(m);
    const calendarEvents = events
      .map(convertEventModuleToCalendarEvent)
      .filter((e) => (category == undefined ? true : e.category === category));
    return calendarEvents;
  }, [month, year, category]);

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
