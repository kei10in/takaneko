import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";

export const meta: MetaFunction = () => {
  return [
    { title: `スケジュール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこの非公式スケジュールです。",
    },
  ];
};

export default function Index() {
  return (
    <div>
      <div className="sticky top-0 z-40 h-12 w-full border-b border-gray-300 bg-white bg-opacity-90">
        <div className="container mx-auto h-full">
          <div className="mx-4 flex h-full items-center justify-between">
            <p className="text-base font-bold text-gray-600">
              <Link to="/calendar">スケジュール</Link>
            </p>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
