import { MetaFunction, redirect } from "@remix-run/react";
import { dateHref } from "~/features/calendars/utils";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("今日のスケジュール") },
    {
      name: "description",
      content: "高嶺のなでしこの非公式スケジュールです。",
    },
  ];
};

export const loader = async () => {
  const today = NaiveDate.todayInJapan();
  return redirect(dateHref(today));
};

export default function Index() {
  return null;
}
