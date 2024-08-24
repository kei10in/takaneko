import { MetaFunction } from "@remix-run/react";
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
    <article className="container prose mx-auto my-8 px-4">
      <ReleaseNotes />
    </article>
  );
}
