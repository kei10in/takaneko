import { useEffect, useState } from "react";

type Props = React.ComponentProps<"img"> & {
  clip: { x: number; y: number; width: number; height: number };
};

export const ClippedImage: React.FC<Props> = (props: Props) => {
  const { clip, src, ...rest } = props;

  const [clippedSrc, setClippedSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (src == undefined) {
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx == undefined) {
        return;
      }

      canvas.width = clip.width;
      canvas.height = clip.height;

      ctx.drawImage(img, clip.x, clip.y, clip.width, clip.height, 0, 0, clip.width, clip.height);

      const dataUrl = canvas.toDataURL();
      setClippedSrc(dataUrl);
    };
  }, [clip.height, clip.width, clip.x, clip.y, src]);

  // eslint-disable-next-line jsx-a11y/alt-text
  return <img src={clippedSrc} {...rest} />;
};
