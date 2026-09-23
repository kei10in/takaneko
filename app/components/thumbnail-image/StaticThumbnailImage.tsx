import { thumbnailSrcSet } from "~/utils/fileConventions.ts";

type Props = Omit<React.ComponentProps<"img">, "src" | "srcSet" | "alt"> & {
  src: string;
  alt: string;
};

export const StaticThumbnailImage: React.FC<Props> = (props: Props) => {
  const { src, alt, ...rest } = props;
  const thumbnail = thumbnailSrcSet(src);

  return <img {...rest} src={thumbnail.src} srcSet={thumbnail.srcset} alt={alt} />;
};
