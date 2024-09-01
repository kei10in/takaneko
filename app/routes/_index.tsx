import { Link, MetaFunction } from "@remix-run/react";
import clsx from "clsx";
import { HiArrowsRightLeft, HiCalendar } from "react-icons/hi2";
import { SITE_TITLE } from "~/constants";

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

export default function Index() {
  return (
    <div>
      <div className="container mx-auto">
        <div className="relative mx-auto w-fit lg:static lg:flex lg:w-full lg:max-w-5xl lg:px-4">
          <img
            className="max-h-96 w-full min-w-96 lg:h-96 lg:w-auto lg:max-w-none lg:flex-none lg:object-contain"
            src="/takaneko/hero.jpg"
            alt="ヒーロー画像"
          />
          <div
            className={clsx(
              "absolute bottom-0 w-full bg-nadeshiko-100 bg-opacity-90 px-6 py-4",
              "lg:static lg:flex-1 lg:px-10 lg:py-8",
            )}
          >
            <h1 className="text-right font-serif text-2xl font-bold leading-tight text-gray-500 lg:text-5xl">
              <span className="text-nadeshiko-900">高嶺のなでしこの</span>
              <br />
              ファンサイト
              <span className="text-nadeshiko-900"></span>
            </h1>

            <div className="mt-2 flex select-none justify-end gap-1 text-sm font-semibold">
              <Link to="/trade">
                <div className="flex h-7 items-center gap-1 rounded-md bg-nadeshiko-900 px-2 text-white">
                  <HiArrowsRightLeft className="h-4 w-4" />
                  <div>トレード画像つくるやつ</div>
                </div>
              </Link>
              <Link to="/calendar">
                <div className="flex h-7 w-full items-center gap-1 rounded-md bg-nadeshiko-900 px-4 text-nadeshiko-100">
                  <HiCalendar className="h-4 w-4" />
                  <div>スケジュール</div>
                </div>
              </Link>
            </div>
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
                  <div className="text-lg font-bold">スケジュール</div>
                </div>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
