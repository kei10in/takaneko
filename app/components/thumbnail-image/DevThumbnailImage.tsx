type Props = Omit<React.ComponentProps<"img">, "src" | "srcSet" | "alt"> & {
  src: string;
  alt: string;
};

const thumbnailUrl = (src: string, size: number): string => {
  // Vite の静的配信で扱えるよう & などを保持し、URL・srcset の区切り文字をエンコードする。
  const source = encodeURI(src.replace(/^\//, "")).replace(/[?#,]/g, encodeURIComponent);
  return `/cdn-cgi/image/width=${size},height=${size},fit=contain,format=webp,quality=80/${source}`;
};

export const DevThumbnailImage: React.FC<Props> = (props: Props) => {
  const { src, alt, ...rest } = props;
  const srcSet = [240, 480, 720]
    .map((size, index) => `${thumbnailUrl(src, size)} ${index + 1}x`)
    .join(", ");

  return <img {...rest} src={thumbnailUrl(src, 240)} srcSet={srcSet} alt={alt} />;
};
