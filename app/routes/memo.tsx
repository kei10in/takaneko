import { MetaFunction, Outlet } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";

export const meta: MetaFunction = () => {
  return [
    { title: `メモ - ${SITE_TITLE} - 高嶺のなでしこのファンサイト` },
    {
      name: "description",
      content: "メモです",
    },
  ];
};

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
