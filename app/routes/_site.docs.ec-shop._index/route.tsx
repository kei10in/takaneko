import { MetaFunction } from "react-router";
import { markdownComponents2 } from "~/components/MdComponents2";
import { Mdx } from "~/components/Mdx";
import { pageBox } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import Article from "./article.md";

export const meta: MetaFunction = () => {
  return [
    { title: `高嶺のなでしこオフィシャルショップでログインできない場合の対処方法 - ${SITE_TITLE}` },
    {
      name: "description",
      content:
        "高嶺のなでしこオフィシャルショップでログインできない場合の暫定的な対象方法を説明します。プライベート ブラウズを使うか、Cookie (Web サイト データ) を削除するかのいずれかで対応できます。",
    },
  ];
};

export default function Releases() {
  return (
    <div className="container mx-auto max-w-2xl">
      <section className={pageBox("px-4")}>
        <Mdx Content={Article} components={markdownComponents2} />
      </section>
    </div>
  );
}
