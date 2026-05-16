import { MetaFunction } from "react-router";
import { SITE_TITLE } from "~/constants";
import { Mdx } from "~/components/Mdx";
import { formatTitle } from "~/utils/htmlHeader";
import Terms from "./terms.mdx";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`利用規約`) },
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
