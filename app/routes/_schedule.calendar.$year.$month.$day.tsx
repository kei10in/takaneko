import {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
} from "react-router";
import { DailyCalendar } from "~/features/calendars/DailyCalendar";
import { validateYearMonthDate } from "~/features/calendars/utils";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title =
    data == undefined
      ? "スケジュール"
      : `${displayDateWithDayOfWeek(data.year, data.month, data.day)} のスケジュール`;

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
  const r = validateYearMonthDate({ year: params.year, month: params.month, day: params.day });
  if (r == undefined) {
    throw new Response("", { status: 404 });
  }

  const { year, month, day } = r;
  return { year, month, day };
};

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const r = validateYearMonthDate({ year: params.year, month: params.month, day: params.day });
  if (r == undefined) {
    throw new Response("", { status: 404 });
  }

  const { year, month, day } = r;
  return { year, month, day };
};

export default function Index() {
  const { year, month, day } = useLoaderData<typeof clientLoader>();

  return <DailyCalendar year={year} month={month} day={day} />;
}
