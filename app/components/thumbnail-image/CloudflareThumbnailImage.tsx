import { useRouteLoaderData } from "react-router";
import { DomainName } from "~/constants.ts";
import { loader } from "~/root.tsx";

type Props = Omit<React.ComponentProps<"img">, "src" | "srcSet" | "alt"> & {
  src: string;
  alt: string;
};

const thumbnailUrl = (origin: string, src: string, size: number): string => {
  const source = encodeURI(src.replace(/^\//, ""));
  return `https://${DomainName}/cdn-cgi/image/width=${size},height=${size},fit=contain,format=webp,quality=80/${origin}/${source}`;
};

export const CloudflareThumbnailImage: React.FC<Props> = (props: Props) => {
  const { src, alt, ...rest } = props;
  const data = useRouteLoaderData<typeof loader>("root");
  if (data == undefined) {
    return null;
  }

  const origin = new URL(data.url).origin;
  const srcSet = [240, 480, 720]
    .map((size, index) => `${thumbnailUrl(origin, src, size)} ${index + 1}x`)
    .join(", ");

  return <img {...rest} src={thumbnailUrl(origin, src, 240)} srcSet={srcSet} alt={alt} />;
};
