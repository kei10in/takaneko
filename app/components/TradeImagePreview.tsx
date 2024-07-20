import { useEffect, useState } from "react";
import { ProductImage } from "~/features/productImages";
import { TradeDescription } from "~/features/TradeState";
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
      <img alt="Preview" className="mx-auto select-none" src={dataUrl} width={1280} />
    </div>
  );
};
