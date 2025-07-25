import { MDXContent } from "mdx/types";
import { components } from "./MdComponents";

interface Props {
  Content: MDXContent;
}

export const Mdx: React.FC<Props> = (props: Props) => {
  const { Content } = props;

  return (
    <div className="leading-normal break-words">
      <Content components={components} />
    </div>
  );
};
