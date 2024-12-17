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
import { calendarMonthHref, currentMonthHref, validateYearMonth } from "~/features/calendars/utils";
import { loadEvents } from "~/features/events/events";
import { parseCategory } from "~/features/events/EventType";
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

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const r = validateYearMonth({ year: params.year, month: params.month });
  if (r == undefined) {
    throw new Response("", { status: 404 });
  }

  const url = new URL(request.url);
  const t = url.searchParams.get("t");
  const category = parseCategory(t);

  const { year, month } = r;
  return json({ year, month, category });
};

export const clientLoader = defineClientLoader(async ({ params, request }) => {
  const r = validateYearMonth({ year: params.year, month: params.month });
  if (r == undefined) {
    throw new Response("", { status: 404 });
  }

  const url = new URL(request.url);
  const t = url.searchParams.get("t");
  const category = parseCategory(t);

  const { year, month } = r;
  return json({ year, month, category });
});

export default function Index() {
  const { year, month, category } = useLoaderData<typeof loader>();

  const calendarEvents = useMemo(() => {
    const m = new NaiveMonth(year, month);
    const events = loadEvents(m);
    const calendarEvents = events.filter((e) =>
      category == undefined ? true : e.meta.category === category,
    );
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
      navigate(`${location.search}#${anchor}`, { replace: true });
    }
  }, [location.hash, location.search, month, navigate, year]);

  const urlParam = { search: location.search };

  return (
    <div className="container mx-auto">
      <Calendar
        events={calendarEvents}
        month={m}
        category={category}
        hash={location.hash}
        hrefToday={currentMonthHref(urlParam)}
        hrefPreviousMonth={calendarMonthHref(m.previousMonth(), urlParam)}
        hrefNextMonth={calendarMonthHref(m.nextMonth(), urlParam)}
      />
    </div>
  );
}
