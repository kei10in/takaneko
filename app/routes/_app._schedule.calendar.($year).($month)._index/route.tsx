import { useEffect } from "react";
import {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import { DomainName } from "~/constants";
import { Calendar } from "~/features/calendars/Calendar";
import { calendarEventFromEventModule } from "~/features/calendars/calendarEvents";
import { calendarMonthRange, validateYearMonth } from "~/features/calendars/utils";
import { EventFilters } from "~/features/events/eventFilter";
import { compareEventMeta } from "~/features/events/eventMeta";
import { Events } from "~/features/events/events";
import { displayMonth } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { formatTitle } from "~/utils/htmlHeader";

const makeRobots = (loadedData: Awaited<ReturnType<typeof loader>> | undefined) => {
  if (loadedData == undefined) {
    return [];
  }

  const currentMonth = NaiveDate.todayInJapan().naiveMonth();
  const upperLimitMonth = currentMonth.advance(9);
  const lowerLimitMonth = currentMonth.advance(2);

  const pageMonth = new NaiveMonth(loadedData.year, loadedData.month);
  const isIndexable =
    0 <= pageMonth.differenceInMonths(lowerLimitMonth) &&
    pageMonth.differenceInMonths(upperLimitMonth) < 0;

  return isIndexable ? [] : [{ name: "robots", content: "noindex,follow" }];
};

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  const title =
    loaderData == undefined
      ? "スケジュール"
      : `${displayMonth(loaderData.year, loaderData.month)} のスケジュール`;

  const robots = makeRobots(loaderData);

  return [
    { title: formatTitle(title) },
    {
      name: "description",
      content:
        "高嶺のなでしこの出演予定やリリース情報をまとめた非公式スケジュールです。" +
        "気になるイベント・ライブ・テレビ・ラジオの出演日や雑誌・CDの発売日などを確認しましょう。",
    },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@takanekofan" },
    { name: "twitter:creator", content: "@takanekofan" },
    { name: "twitter:title", content: formatTitle(title) },
    { name: "twitter:image", content: `https://${DomainName}/takanekono-card-schedule.png` },
    ...robots,
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

      const pageMonth = new NaiveMonth(r.year, r.month);
      const [startMonth, lastMonth] = calendarMonthRange(NaiveMonth.current());
      if (
        pageMonth.differenceInMonths(startMonth) < 0 ||
        0 <= pageMonth.differenceInMonths(lastMonth)
      ) {
        throw new Response("", { status: 404 });
      }

      return { ...r, day: undefined };
    }
  })();

  const url = new URL(request.url);
  const t = url.searchParams.get("t");

  const filter = t;

  const eventFilter = EventFilters.find((f) => f.name == filter) ?? EventFilters[0];
  const m = new NaiveMonth(year, month);
  const events = (
    await Promise.all(
      // スライドすることを考慮すると 5 ヶ月分のイベントを取得する必要がある。
      [m.advance(-2), m.advance(-1), m, m.advance(1), m.advance(2)].map((m) =>
        Events.importEventModulesByMonth(m),
      ),
    )
  )
    .flat()
    .filter(eventFilter.predicate)
    .toSorted((a, b) => compareEventMeta(a.meta, b.meta))
    .map(calendarEventFromEventModule);

  return { year, month, day, filter: t, events };
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

  const filter = t;

  const eventFilter = EventFilters.find((f) => f.name == filter) ?? EventFilters[0];
  const m = new NaiveMonth(year, month);
  const events = (
    await Promise.all(
      // スライドすることを考慮すると 5 ヶ月分のイベントを取得する必要がある。
      [m.advance(-2), m.advance(-1), m, m.advance(1), m.advance(2)].map((m) =>
        Events.importEventModulesByMonth(m),
      ),
    )
  )
    .flat()
    .filter(eventFilter.predicate)
    .toSorted((a, b) => compareEventMeta(a.meta, b.meta))
    .map(calendarEventFromEventModule);

  return { year, month, day, filter: t, events };
};

export default function Index() {
  const { year, month, day, filter, events } = useLoaderData<typeof loader>();

  const filterName = EventFilters.find((f) => f.name == filter)?.name ?? EventFilters[0].name;

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
    <div className="@container">
      <Calendar events={events} month={m} filter={filterName} />
    </div>
  );
}
