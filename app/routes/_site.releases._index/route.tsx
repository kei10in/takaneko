import { MetaFunction } from "react-router";
import { Markdown } from "~/components/Markdown";
import { SITE_TITLE } from "~/constants";
import ReleaseNotes from "../../../RELEASES.md?raw";

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
    <article className="container mx-auto my-8 max-w-xl px-4">
      <Markdown>{ReleaseNotes}</Markdown>
    </article>
  );
}
