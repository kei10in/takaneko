import { forwardRef, Ref, useMemo } from "react";
import { ImagePosition } from "~/features/products/product";
import { stampPositions } from "~/features/trade/stampPosition";
import { TradeDescription, tradeStateToImageSrc } from "~/features/trade/TradeStatus";

interface Props {
  image: { url: string; width: number; height: number };
  width: number;
  height?: number;
  positions: ImagePosition[];
  tradeDescriptions: Record<number, TradeDescription>;
  showRect?: boolean;
  onLoad?: () => void;
}

export const HtmlTradeImage = forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
  const { image, width, height, positions, tradeDescriptions, showRect = false, onLoad } = props;

  const scaleX = width / image.width;
  const scaleY = height == undefined ? scaleX : height / image.height;

  const stamps = useMemo(() => stampPositions(positions), [positions]);

  return (
    <div key={image.url} className="relative" ref={ref}>
      <img
        src={image.url}
        alt="Product set"
        width={width}
        height={height}
        className="max-w-none"
        onLoad={onLoad}
      />

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

      {stamps.map((pos) => {
        const trade = tradeDescriptions[pos.id];
        if (trade == undefined) {
          return null;
        }

        const { x, y, width, height } = pos;

        const src = tradeStateToImageSrc(trade.status);
        if (src != undefined) {
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
        } else if (trade.status.tag === "emoji") {
          return (
            <div
              key={trade.id}
              className="absolute flex items-center justify-center text-center leading-none"
              style={{
                left: x * scaleX,
                top: y * scaleY,
                width: width * scaleX,
                height: height * scaleY,
                fontSize: height * scaleY * 0.9,
              }}
            >
              <div>{trade.status.emoji}</div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
});

HtmlTradeImage.displayName = "HtmlTradeImage";
