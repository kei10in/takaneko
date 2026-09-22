import { CloudflareThumbnailImage } from "~/components/thumbnail-image/CloudflareThumbnailImage";
import { DevThumbnailImage } from "~/components/thumbnail-image/DevThumbnailImage";

type Props = React.ComponentProps<typeof DevThumbnailImage>;

export const ThumbnailImage: React.FC<Props> = (props: Props) => {
  if (import.meta.env.DEV) {
    return <DevThumbnailImage {...props} />;
  }

  return <CloudflareThumbnailImage {...props} />;
};
