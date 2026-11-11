import { MetaFunction } from "react-router";
import { pageBox, pageHeading } from "~/components/styles.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("ライブ統計") },
    {
      name: "description",
      content: "高嶺のなでしこのライブ開催実績と、年別・月別のステージ数の推移をまとめています。",
    },
  ];
};

export default function Component() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>ライブ統計</h1>
      </section>
    </div>
  );
}
