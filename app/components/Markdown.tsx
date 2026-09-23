import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { allowBrTags } from "~/utils/rehype/allowBrTags.ts";
import { gfmAlert } from "../utils/rehype/gfmAlert.ts";
import { components as markdownComponents } from "./MdComponents.tsx";

interface Props {
  components?: Components;
  children: string | undefined;
}

export const Markdown: React.FC<Props> = (props: Props) => {
  const { children, components = markdownComponents } = props;

  return (
    <div>
      <ReactMarkdown
        components={components}
        remarkPlugins={[allowBrTags, remarkGfm]}
        skipHtml={true}
        rehypePlugins={[gfmAlert]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
