import type { MetaFunction } from "@remix-run/node";
import ReleaseNotes from "../../RELEASES.md";

export const meta: MetaFunction = () => {
  return [
    { title: "リリース ノート - トレード画像つくるやつ。" },
    {
      name: "description",
      content: "「トレード画像つくるやつ。」のリリース ノートです。",
    },
  ];
};

export default function Releases() {
  return (
    <article className="prose container mx-auto my-8">
      <ReleaseNotes />
    </article>
  );
}
