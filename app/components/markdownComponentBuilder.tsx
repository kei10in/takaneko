import { MDXContent, MDXProps } from "mdx/types";
import { Components } from "react-markdown";
import { Markdown } from "./Markdown.tsx";

export const makeMarkdownComponent = (mdStr: string): MDXContent => {
  const MarkdownContent = (props: MDXProps) => {
    const { components, ...restProps } = props;
    return (
      // MDX の型は入れ子のコンポーネントも許容するため、ReactMarkdown と一致しません。
      // 呼び出し元からは HTML 要素用のコンポーネントを受け取ります。
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      <Markdown components={components as Components} {...restProps}>
        {mdStr}
      </Markdown>
    );
  };
  return MarkdownContent;
};
