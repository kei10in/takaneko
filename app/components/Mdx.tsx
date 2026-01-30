import { MDXContent } from "mdx/types";
import { Components } from "react-markdown";
import { components as markdownComponents } from "./MdComponents";

interface Props {
  components?: Components;
  Content: MDXContent;
}

export const Mdx: React.FC<Props> = (props: Props) => {
  const { Content, components = markdownComponents } = props;

  return (
    <div className="leading-normal wrap-break-word">
      <Content components={components} />
    </div>
  );
};
