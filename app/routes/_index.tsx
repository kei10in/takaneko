import { Link, MetaFunction } from "@remix-run/react";
import { HiArrowsRightLeft, HiCalendar } from "react-icons/hi2";
import { Footer } from "~/components/Footer";
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
      <div className="container mx-auto mt-4">
        <div className="mx-auto h-56 w-full max-w-md bg-gray-200">
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-xl">🚧かわいらしいヒーロー画像 (工事中)🚧</p>
          </div>
        </div>
        <section className="mx-auto mt-4 w-full max-w-md">
          <h2 className="mx-4 text-lg font-semibold">コンテンツ</h2>
          <ul className="mx-4 my-4 space-y-2">
            <li>
              <Link to="/trade">
                <div className="flex h-16 items-center gap-4 rounded-lg bg-gray-600 px-4 text-white">
                  <HiArrowsRightLeft className="h-8 w-8" />
                  <div className="text-lg font-bold">トレード画像つくるやつ</div>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/calendar">
                <div className="flex h-16 w-full items-center gap-4 rounded-lg bg-gray-600 px-4 text-white">
                  <HiCalendar className="h-8 w-8" />
                  <div className="text-lg font-bold">スケジュール</div>
                </div>
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <Footer className="mt-8" />
    </div>
  );
}
