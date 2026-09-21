import { CloudflareThumbnailImage } from "~/components/thumbnail-image/CloudflareThumbnailImage";
import { StaticThumbnailImage } from "~/components/thumbnail-image/StaticThumbnailImage";

type Props = React.ComponentProps<typeof StaticThumbnailImage>;

export const ThumbnailImage: React.FC<Props> = (props: Props) => {
  if (import.meta.env.DEV) {
    return <StaticThumbnailImage {...props} />;
  }

  return <CloudflareThumbnailImage {...props} />;
};
