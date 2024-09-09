import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  unstable_defineClientLoader as defineClientLoader,
  MetaFunction,
  useLoaderData,
} from "@remix-run/react";
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
      content: "高嶺のなでしこの非公式スケジュールです。",
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const r = validateYearMonthDate({ year: params.year, month: params.month, day: params.date });
  if (r == undefined) {
    throw new Response("", { status: 404 });
  }

  const { year, month, day } = r;
  return { year, month, day };
};

export const clientLoader = defineClientLoader(async ({ params }) => {
  const r = validateYearMonthDate({ year: params.year, month: params.month, day: params.date });
  if (r == undefined) {
    throw new Response("", { status: 404 });
  }

  const { year, month, day } = r;
  return { year, month, day };
});

export default function Index() {
  const { year, month, day } = useLoaderData<typeof clientLoader>();

  return <DailyCalendar year={year} month={month} day={day} />;
}
