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
        <div className="w-full">
          <img className="mx-auto w-full max-w-3xl" src="/takaneko/hero.webp" alt="ヒーロー画像" />
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
