import { MetaFunction } from "react-router";
import { Mdx } from "~/components/Mdx";
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
    <article className="container mx-auto my-8 max-w-xl space-y-4 px-4">
      <Mdx Content={Article} />
    </article>
  );
}
