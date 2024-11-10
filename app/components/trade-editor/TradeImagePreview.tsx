import { useEffect, useState } from "react";
import { BsBoxArrowUp } from "react-icons/bs";
import { RandomGoods } from "~/features/products/product";
import { TradeDescription } from "~/features/TradeStatus";
import { PARSED_UA } from "~/utils/ua";
import { ImageLoader } from "../ImageLoader";
import { drawTradeImage } from "./drawTradeImage";
import { shareTradeImage } from "./shareTradeImage";

interface Props {
  productImage: RandomGoods;
  tradeDescriptions: Record<number, TradeDescription>;
}

export const TradeImagePreview: React.FC<Props> = (props: Props) => {
  const { productImage, tradeDescriptions } = props;

  const [dataUrl, setDataUrl] = useState<string | undefined>(undefined);

  const previewWidth = 320;
  const previewHeight = productImage.height * (previewWidth / productImage.width);

  useEffect(() => {
    const canvas = document.createElement("canvas");

    drawTradeImage(canvas, productImage, tradeDescriptions).then(() => {
      const dataUrl = canvas.toDataURL("image/webp", 0.95);
      setDataUrl(dataUrl);
    });

    return;
  }, [productImage, tradeDescriptions]);

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

      {window?.navigator?.share != undefined && (
        <div className="mx-auto" style={{ width: previewWidth }}>
          <button
            className="group ml-auto block h-10 w-10 rounded-xl p-1 transition-colors"
            onClick={() => shareTradeImage(productImage, tradeDescriptions)}
          >
            <div className="flex items-center justify-center">
              <BsBoxArrowUp className="h-6 w-6 text-gray-600" />
            </div>
          </button>
        </div>
      )}

      <p className="mt-2 text-center text-sm text-gray-500">{desc}</p>
    </div>
  );
};
