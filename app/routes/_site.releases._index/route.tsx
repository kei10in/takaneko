import { MetaFunction } from "react-router";
import { Markdown } from "~/components/Markdown";
import { SiteName } from "~/constants";
import { formatTitle } from "~/utils/htmlHeader";
import ReleaseNotes from "../../../RELEASES.md?raw";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`リリース ノート`) },
    {
      name: "description",
      content: `「${SiteName}」のリリース ノートです。`,
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
