import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { allowBrTags } from "~/utils/rehype/allowBrTags";
import { gfmAlert } from "../utils/rehype/gfmAlert";
import { components as markdownComponents } from "./MdComponents";

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
