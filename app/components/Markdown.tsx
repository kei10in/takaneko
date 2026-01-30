import { Break, Nodes } from "mdast";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { map } from "unist-util-map";
import { components as markdownComponents } from "./MdComponents";

const allowBrTags = () => {
  return (tree: Nodes) => {
    return map(tree, (node) => {
      if (node.type === "html" && /<br\s*\/?>/.test(node.value)) {
        const newNode: Break = { type: "break" };
        return newNode;
      }

      return node;
    });
  };
};

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
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
