import { MetaFunction } from "react-router";
import { formatTitle } from "~/utils/htmlHeader.ts";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("楽曲統計") },
    {
      name: "description",
      content: "高嶺のなでしこの楽曲の統計情報です。",
    },
  ];
};

export default function Component() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="page-box px-4">
        <h1 className="page-heading">楽曲統計</h1>
      </section>
    </div>
  );
}
