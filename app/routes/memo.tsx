import {
  unstable_defineClientLoader as defineClientLoader,
  MetaFunction,
  Outlet,
} from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { loadEventsInDay } from "~/features/events/events";
import { getActiveDateInJapan } from "~/utils/japanTime";

export const meta: MetaFunction = () => {
  return [
    { title: `メモ - ${SITE_TITLE} - 高嶺のなでしこのファンサイト` },
    {
      name: "description",
      content: "メモです",
    },
  ];
};

export const clientLoader = defineClientLoader(async (_args) => {
  const date = getActiveDateInJapan(new Date());
  const events = loadEventsInDay(date);
  return { date, events };
});

export default function Index() {
  return (
    <div className="container mx-auto text-gray-600">
      <section className="mt-12">
        <h1 id="organizing" className="mb-4 text-2xl">
          メモ
        </h1>

        <p>このページは今後まとめていく予定の情報をメモしたページです。</p>

        <article className="markdown">
          <Outlet />
        </article>
      </section>
    </div>
  );
}
