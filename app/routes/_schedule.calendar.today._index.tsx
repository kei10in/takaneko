import {
  unstable_defineClientLoader as defineClientLoader,
  MetaFunction,
  redirect,
} from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { dateHref } from "~/features/calendars/utils";

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
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  return redirect(dateHref(year, month, date));
});

export default function Index() {
  return null;
}
