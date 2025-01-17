import { Break, Nodes } from "mdast";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { map } from "unist-util-map";

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
  children: string | undefined;
}

const components: Components = {
  p: ({ children }) => <p className="mt-1 text-sm">{children}</p>,
};

export const Markdown: React.FC<Props> = (props: Props) => {
  const { children } = props;

  return (
    <ReactMarkdown components={components} remarkPlugins={[allowBrTags, remarkGfm]} skipHtml={true}>
      {children}
    </ReactMarkdown>
  );
};
