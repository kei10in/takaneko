import { forwardRef, Ref, useMemo } from "react";
import { ImagePosition } from "~/features/products/product";
import { stampPositions } from "~/features/trade/stampPosition";
import { TradeDescription } from "~/features/trade/TradeStatus";
import { TradeStatusStamp } from "./TradeStatusStamp";

interface Props {
  image: { url: string; width: number; height: number };
  alt: string;
  width: number;
  height?: number;
  positions: ImagePosition[];
  tradeDescriptions: Record<number, TradeDescription>;
  showRect?: boolean;
  onLoad?: () => void;
}

export const HtmlTradeImage = forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
  const {
    image,
    alt,
    width,
    height,
    positions,
    tradeDescriptions,
    showRect = false,
    onLoad,
  } = props;

  const scaleX = width / image.width;
  const scaleY = height == undefined ? scaleX : height / image.height;

  const stamps = useMemo(() => stampPositions(positions), [positions]);

  return (
    <div key={image.url} className="relative" ref={ref}>
      <img
        src={image.url}
        alt={alt}
        width={width}
        height={height ?? scaleY * image.height}
        className="max-w-none bg-gray-50 text-sm text-gray-500"
        onLoad={onLoad}
      />

      {showRect
        ? positions.map((pos) => {
            return (
              <div
                key={pos.id}
                className="absolute bg-black/20"
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
        const { x, y, width, height } = pos;

        return (
          <TradeStatusStamp
            key={pos.id}
            status={trade?.status}
            x={x * scaleX}
            y={y * scaleY}
            width={width * scaleX}
            height={height * scaleY}
          />
        );
      })}
    </div>
  );
});

HtmlTradeImage.displayName = "HtmlTradeImage";
