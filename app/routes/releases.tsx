import { MetaFunction } from "react-router";
import { SITE_TITLE } from "~/constants";
import ReleaseNotes from "../../RELEASES.md";

export const meta: MetaFunction = () => {
  return [
    { title: `リリース ノート - ${SITE_TITLE}` },
    {
      name: "description",
      content: `「${SITE_TITLE}」のリリース ノートです。`,
    },
  ];
};

export default function Releases() {
  return (
    <article className="markdown container mx-auto my-8 max-w-xl px-4">
      <ReleaseNotes />
    </article>
  );
}
