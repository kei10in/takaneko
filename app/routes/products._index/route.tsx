import {
  unstable_defineClientLoader as defineClientLoader,
  Link,
  MetaFunction,
} from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { loadEventsInDay } from "~/features/events/events";
import { getActiveDateInJapan } from "~/utils/japanTime";
import Content from "./memo.mdx";

export const meta: MetaFunction = () => {
  return [
    { title: `${SITE_TITLE} - 高嶺のなでしこのファンサイト` },
    {
      name: "description",
      content:
        "高嶺のなでしこの非公式ファンサイト。トレード画像をつくるやつでは、これまで発売された生写真やミニフォトカードなどのランダムグッズのトレード用の画像を作成できます。スケジュールでは、高嶺のなでしこのライブやイベント、テレビ出演などのスケジュールを確認することができます。",
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
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">グッズ</h1>
        <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4">
          <p className="mb-2 font-bold">🚧工事中🚧</p>
          <p>たかねこのグッズのページは現在作成中です。</p>
          <p>
            「
            <Link className="text-nadeshiko-800" to="#organizing">
              整理中
            </Link>
            」のところに記載のないグッズをご存じの場合は{" "}
            <Link className="text-nadeshiko-800" to="https://x.com/takanekofan">
              @takanekofan
            </Link>{" "}
            までご連絡いただけると助かります。
          </p>
        </div>

        <section className="mt-12">
          <h2 id="organizing" className="text-2xl">
            整理中
          </h2>
          <article className="markdown">
            <Content />
          </article>
        </section>
      </section>
    </div>
  );
}
