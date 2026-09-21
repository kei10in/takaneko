import { StaticThumbnailImage } from "~/components/StaticThumbnailImage";

type Props = React.ComponentProps<typeof StaticThumbnailImage>;

export const ThumbnailImage: React.FC<Props> = (props: Props) => {
  return <StaticThumbnailImage {...props} />;
};
