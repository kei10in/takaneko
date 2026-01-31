import { MetaFunction } from "react-router";
import { Markdown } from "~/components/Markdown";
import { markdownComponents2 } from "~/components/MdComponents2";
import { pageBox } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import article from "./article.md?raw";

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
        <Markdown components={markdownComponents2}>{article}</Markdown>
      </section>
    </div>
  );
}
