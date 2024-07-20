import { forwardRef, Ref } from "react";
import { ImagePosition } from "~/features/productImages";
import { TradeState, tradeStateToImageSrc } from "~/features/TradeState";

interface Props {
  image: { url: string; width: number; height: number };
  width: number;
  height?: number;
  positions: ImagePosition[];
  tradeDescriptions: { id: number; state: TradeState }[];
  showRect?: boolean;
}

export const HtmlTradeImage = forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
  const { image, width, height, positions, tradeDescriptions, showRect = false } = props;

  const scaleX = width / image.width;
  const scaleY = height == undefined ? scaleX : height / image.height;

  return (
    <div className="relative" ref={ref}>
      <img src={image.url} alt="Product set" width={width} height={height} className="max-w-none" />

      {showRect
        ? positions.map((pos) => {
            return (
              <div
                key={pos.id}
                className="absolute bg-black bg-opacity-20"
                style={{
                  left: pos.x * scaleX,
                  top: pos.y * scaleY,
                  width: pos.width * scaleX,
                  height: pos.height * scaleY,
                }}
              />
            );
          })
        : null}

      {tradeDescriptions.map((trade) => {
        const pos = positions.find((pos) => pos.id == trade.id);
        if (pos == undefined) {
          return null;
        }

        const src = tradeStateToImageSrc(trade.state);
        if (src == undefined) {
          return null;
        }

        const width = pos.width / 1.5;
        const height = width;
        const x = pos.x + pos.width / 2 - width / 2;
        const y = pos.y + pos.height - height - 5;

        return (
          <img
            key={trade.id}
            src={src}
            alt=""
            className="absolute"
            style={{
              left: x * scaleX,
              top: y * scaleY,
              width: width * scaleX,
              height: height * scaleY,
            }}
          />
        );
      })}
    </div>
  );
});

HtmlTradeImage.displayName = "HtmlTradeImage";
