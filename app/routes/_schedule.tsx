import { Link, MetaFunction, Outlet } from "@remix-run/react";
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
      <div className="sticky top-0 z-10 h-12 w-full border-b border-nadeshiko-200 bg-nadeshiko-200 bg-opacity-90 backdrop-blur lg:top-[var(--header-height)]">
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
