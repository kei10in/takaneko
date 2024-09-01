import { MetaFunction, redirect } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { calendarMonthHref } from "~/features/calendars/utils";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";

export const meta: MetaFunction = () => {
  return [
    { title: `スケジュール - ${SITE_TITLE}` },
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
