import { MetaFunction } from "react-router";
import { Mdx } from "~/components/Mdx";
import { formatTitle } from "~/utils/htmlHeader";
import Memo from "./memo.mdx";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("メモ") },
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

        <article>
          <Mdx Content={Memo} />
        </article>
      </section>
    </div>
  );
}
