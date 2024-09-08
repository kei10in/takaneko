import { MetaFunction, redirect } from "@remix-run/react";
import { calendarMonthHref } from "~/features/calendars/utils";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("スケジュール") },
    {
      name: "description",
      content: "高嶺のなでしこの非公式スケジュールです。",
    },
  ];
};

export const loader = async () => {
  const currentMonth = NaiveMonth.current();
  return redirect(calendarMonthHref(currentMonth));
};

export default function Index() {
  return null;
}
