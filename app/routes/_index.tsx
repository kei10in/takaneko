import { Link, MetaFunction } from "@remix-run/react";
import { HiArrowsRightLeft, HiCalendar } from "react-icons/hi2";
import { SITE_TITLE } from "~/constants";

export const meta: MetaFunction = () => {
  return [
    { title: SITE_TITLE },
    {
      name: "description",
      content: "高嶺のなでしこ、たかねこのファンサイトです。",
    },
  ];
};

export default function Index() {
  return (
    <div>
      <div className="container mx-auto">
        <div className="relative mx-auto w-fit">
          <img
            className="w-full min-w-96 max-w-md md:max-w-3xl"
            src="/takaneko/hero.jpg"
            alt="ヒーロー画像"
          />
          <div className="absolute bottom-0 w-full bg-nadeshiko-100 bg-opacity-90 px-6 py-4 md:px-10 md:py-8">
            <h1 className="text-right font-serif text-2xl font-bold leading-tight text-gray-500 md:text-5xl">
              <span className="text-nadeshiko-900">高嶺のなでしこの</span>
              <br />
              ファンサイト
              <span className="text-nadeshiko-900"></span>
            </h1>
          </div>
        </div>
        <section className="mx-auto mt-4 w-full max-w-md pb-12">
          <h2 className="mx-4 text-lg font-semibold text-gray-500">コンテンツ</h2>
          <ul className="mx-4 my-4 space-y-2">
            <li>
              <Link to="/trade">
                <div className="flex h-16 items-center gap-4 rounded-lg border border-nadeshiko-500 bg-nadeshiko-100 px-4 text-nadeshiko-700">
                  <HiArrowsRightLeft className="h-8 w-8" />
                  <div className="text-lg font-bold">トレード画像つくるやつ</div>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/calendar">
                <div className="flex h-16 w-full items-center gap-4 rounded-lg border border-nadeshiko-500 bg-nadeshiko-100 px-4 text-nadeshiko-700">
                  <HiCalendar className="h-8 w-8" />
                  <div className="text-lg font-bold">スケジュール (β)</div>
                </div>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
