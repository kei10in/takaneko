import { MDXContent, MDXProps } from "mdx/types";
import { Components } from "react-markdown";
import { Markdown } from "./Markdown";

export const makeMarkdownComponent = (mdStr: string): MDXContent => {
  const MarkdownContent = (props: MDXProps) => {
    const { components, ...restProps } = props;
    return (
      // MDXComponents の型は ReactMarkdown の Components と完全には一致しないけど、
      // ここでは文脈的に問題なし。
      // 将来的に `MDXContent` で返す構成自体が変わる見込み。
      <Markdown components={components as Components} {...restProps}>
        {mdStr}
      </Markdown>
    );
  };
  return MarkdownContent;
};
