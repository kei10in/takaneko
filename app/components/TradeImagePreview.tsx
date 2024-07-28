import { useEffect, useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import { ProductImage } from "~/features/productImages";
import { TradeDescription } from "~/features/TradeStatus";
import { PARSED_UA } from "~/utils/ua";
import { drawTradeImage } from "./drawTradeImage";

interface Props {
  productImage: ProductImage;
  tradeDescriptions: Record<number, TradeDescription>;
}

export const TradeImagePreview: React.FC<Props> = (props: Props) => {
  const { productImage, tradeDescriptions } = props;

  const [dataUrl, setDataUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = productImage.width;
    canvas.height = productImage.height;

    drawTradeImage(canvas, productImage, tradeDescriptions).then(() => {
      const dataUrl = canvas.toDataURL();
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
      {dataUrl == undefined ? (
        <div className="flex items-center justify-center p-4">
          <HiArrowPath size="1.75rem" className="animate-spin text-gray-700" />
        </div>
      ) : (
        <div>
          <figure className="mx-auto">
            <img alt="Preview" className="select-none" src={dataUrl} width={1280} />
          </figure>
          <p className="mt-2 text-center text-sm text-gray-500">{desc}</p>
        </div>
      )}
    </div>
  );
};
