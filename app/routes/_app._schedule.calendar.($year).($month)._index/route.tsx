import { useEffect, useMemo } from "react";
import {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import { Calendar } from "~/features/calendars/Calendar";
import { validateYearMonth } from "~/features/calendars/utils";
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
  const { year, month, day } = (() => {
    if (params.year == undefined && params.month == undefined) {
      const m = NaiveDate.todayInJapan();
      return { year: m.year, month: m.month, day: m.day };
    } else {
      const r = validateYearMonth({ year: params.year, month: params.month });
      if (r == undefined) {
        throw new Response("", { status: 404 });
      }
      return { ...r, day: undefined };
    }
  })();

  const url = new URL(request.url);
  const t = url.searchParams.get("t");
  const category = parseCategory(t);

  return { year, month, day, category };
};

export const clientLoader = async ({ params, request }: ClientLoaderFunctionArgs) => {
  const { year, month, day } = (() => {
    if (params.year == undefined && params.month == undefined) {
      const m = NaiveDate.today();
      return { year: m.year, month: m.month, day: m.day };
    } else {
      const r = validateYearMonth({ year: params.year, month: params.month });
      if (r == undefined) {
        throw new Response("", { status: 404 });
      }
      return { ...r, day: undefined };
    }
  })();

  const url = new URL(request.url);
  const t = url.searchParams.get("t");
  const category = parseCategory(t);

  return { year, month, day, category };
};

export default function Index() {
  const { year, month, day, category } = useLoaderData<typeof loader>();

  const calendarEvents = useMemo(() => {
    const m = new NaiveMonth(year, month);
    // スライドすることを考慮すると 5 ヶ月分のイベントを取得する必要がある。
    const events = loadEvents([m.advance(-2), m.advance(-1), m, m.advance(1), m.advance(2)]);
    const calendarEvents = events.filter((e) =>
      category == undefined ? true : e.meta.category === category,
    );
    return calendarEvents;
  }, [month, year, category]);

  const m = new NaiveMonth(year, month);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (day == undefined) {
      return;
    }

    if (location.hash == "") {
      const date = new NaiveDate(year, month, day);
      const anchor = date.toString();

      const elem = document.getElementById(anchor);
      elem?.scrollIntoView({ behavior: "smooth" });
    }
  }, [day, location.hash, location.search, month, navigate, year]);

  return (
    <div className="container mx-auto">
      <Calendar events={calendarEvents} month={m} category={category} />
    </div>
  );
}
