import { Image } from "react-konva";
import useImage from "use-image";

type Props =
  | Omit<React.ComponentProps<typeof Image>, "image">
  | {
      src: string;
    };

export const SrcImage: React.FC<Props> = (props: Props) => {
  const { src, ...rest } = props;

  const [icon] = useImage(src);

  return <Image image={icon} {...rest} />;
};
