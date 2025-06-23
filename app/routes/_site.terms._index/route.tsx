import { MetaFunction } from "react-router";
import { Mdx } from "~/components/Mdx";
import { SITE_TITLE } from "~/constants";
import Terms from "./terms.mdx";

export const meta: MetaFunction = () => {
  return [
    { title: `利用規約 - ${SITE_TITLE}` },
    {
      name: "description",
      content: `「${SITE_TITLE}」の利用規約`,
    },
  ];
};

export default function Releases() {
  return (
    <article className="container mx-auto my-8 max-w-xl space-y-4 px-4">
      <Mdx Content={Terms} />
    </article>
  );
}
