import { useEffect, useState } from "react";
import { ProductImage } from "~/features/products/product";
import { TradeDescription } from "~/features/TradeStatus";
import { PARSED_UA } from "~/utils/ua";
import { drawTradeImage } from "./drawTradeImage";
import { ImageLoader } from "./ImageLoader";

interface Props {
  productImage: ProductImage;
  tradeDescriptions: Record<number, TradeDescription>;
}

export const TradeImagePreview: React.FC<Props> = (props: Props) => {
  const { productImage, tradeDescriptions } = props;

  const [dataUrl, setDataUrl] = useState<string | undefined>(undefined);

  const imageWidth = 1280;
  const imageHeight = (imageWidth / productImage.width) * productImage.height;
  const previewWidth = 320;
  const previewHeight = imageHeight * (previewWidth / imageWidth);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    drawTradeImage(canvas, productImage, tradeDescriptions).then(() => {
      const dataUrl = canvas.toDataURL();
      setDataUrl(dataUrl);
    });

    return;
  }, [imageHeight, productImage, tradeDescriptions]);

  const descForIOS = '画像を長押しして「"写真" に保存」を選択します。';
  const descForAndroid = "画像を長押しして「画像を保存」を選択します。";
  const descForDesktop = "画像を右クリックして「名前を付けて画像を保存」を選択します。";

  const desc =
    PARSED_UA.os.name == "iOS"
      ? descForIOS
      : PARSED_UA.os.name == "Android" || ["mobile", "tablet"].includes(PARSED_UA.device.type ?? "")
        ? descForAndroid
        : descForDesktop;

  return (
    <div>
      <figure className="mx-auto" style={{ width: previewWidth, height: previewHeight }}>
        {dataUrl == undefined ? (
          <ImageLoader width={previewWidth} height={previewHeight} />
        ) : (
          <img
            alt="Preview"
            className="select-none"
            src={dataUrl}
            width={previewWidth}
            height={previewHeight}
          />
        )}
      </figure>
      <p className="mt-2 text-center text-sm text-gray-500">{desc}</p>
    </div>
  );
};
