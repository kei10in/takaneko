import { MetaFunction, redirect } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { dateHref } from "~/features/calendars/utils";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

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
  const today = NaiveDate.todayInJapan();
  return redirect(dateHref(today));
};

export default function Index() {
  return null;
}
