import {
  unstable_defineClientLoader as defineClientLoader,
  MetaFunction,
  redirect,
} from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { dateHref } from "~/features/calendars/utils";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

export const meta: MetaFunction = () => {
  return [
    { title: `スケジュール (β) - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこの非公式スケジュールです。",
    },
  ];
};

export const clientLoader = defineClientLoader(async () => {
  const today = NaiveDate.today();
  return redirect(dateHref(today));
});

export default function Index() {
  return null;
}
