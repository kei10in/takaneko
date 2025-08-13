import { MetaFunction, useLoaderData } from "react-router";
import { DOMAIN } from "~/constants";
import { calendarEventFromEventModule } from "~/features/calendars/calendarEvents";
import { DailyCalendar } from "~/features/calendars/DailyCalendar";
import { dateHref } from "~/features/calendars/utils";
import { importEventModulesByDate } from "~/features/events/eventModule";
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

export const loader = async () => {
  const today = NaiveDate.todayInJapan();

  const { year, month, day } = today;
  const events = (await importEventModulesByDate(today)).map(calendarEventFromEventModule);

  return { year, month, day, events };
};

export const clientLoader = async () => {
  const today = NaiveDate.todayInJapan();

  const { year, month, day } = today;
  const events = (await importEventModulesByDate(today)).map(calendarEventFromEventModule);

  return { year, month, day, events };
};

export default function Index() {
  const { year, month, day, events } = useLoaderData();

  return <DailyCalendar year={year} month={month} day={day} events={events} />;
}
