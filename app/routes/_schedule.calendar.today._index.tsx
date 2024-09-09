import { MetaFunction } from "@remix-run/react";
import { DOMAIN } from "~/constants";
import { DailyCalendar } from "~/features/calendars/DailyCalendar";
import { dateHref } from "~/features/calendars/utils";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = () => {
  const today = NaiveDate.todayInJapan();

  return [
    { title: formatTitle("今日のスケジュール") },
    {
      name: "description",
      content:
        "高嶺のなでしこの出演予定やリリース情報をまとめた非公式スケジュールです。" +
        "気になるイベント・ライブ・テレビ・ラジオの出演日や雑誌・CDの発売日などを確認しましょう。",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://${DOMAIN}${dateHref(today)}`,
    },
  ];
};

export default function Index() {
  const today = NaiveDate.todayInJapan();

  return <DailyCalendar year={today.year} month={today.month} day={today.day} />;
}
