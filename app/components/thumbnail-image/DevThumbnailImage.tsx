type Props = Omit<React.ComponentProps<"img">, "src" | "srcSet" | "alt"> & {
  src: string;
  alt: string;
};

const thumbnailUrl = (src: string, size: number): string =>
  `/__thumbnail?${new URLSearchParams({ src, size: String(size) })}`;

export const DevThumbnailImage: React.FC<Props> = (props: Props) => {
  const { src, alt, ...rest } = props;
  const srcSet = [240, 480, 720]
    .map((size, index) => `${thumbnailUrl(src, size)} ${index + 1}x`)
    .join(", ");

  return <img {...rest} src={thumbnailUrl(src, 240)} srcSet={srcSet} alt={alt} />;
};
