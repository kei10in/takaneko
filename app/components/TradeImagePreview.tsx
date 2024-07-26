import { useEffect, useState } from "react";
import { TbProgress } from "react-icons/tb";
import { ProductImage } from "~/features/productImages";
import { TradeDescription } from "~/features/TradeStatus";
import { drawTradeImage } from "./drawTradeImage";

interface Props {
  productImage: ProductImage;
  tradeDescriptions: TradeDescription[];
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

  return (
    <div>
      {dataUrl == undefined ? (
        <div className="flex items-center justify-center p-4">
          <TbProgress size="1.75rem" className="animate-spin text-gray-700" />
        </div>
      ) : (
        <img alt="Preview" className="mx-auto select-none" src={dataUrl} width={1280} />
      )}
    </div>
  );
};
