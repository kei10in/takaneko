import Konva from "konva";
import { forwardRef, Ref } from "react";
import { Group, Layer, Rect, Stage } from "react-konva";
import { ImagePosition } from "~/features/productImages";
import { stampPosition } from "~/features/trade/stampPosition";
import { tradeStateToImageSrc, TradeStatus } from "~/features/TradeStatus";
import { SrcImage } from "./SrcImage";

interface Props {
  image: { url: string; width: number; height: number };
  width: number;
  height?: number;
  positions: ImagePosition[];
  tradeDescriptions: { id: number; state: TradeStatus }[];
  showRect?: boolean;
}

export const KonvaTradeImage = forwardRef<Konva.Stage, Props>(
  (props: Props, ref: Ref<Konva.Stage>) => {
    const { image, width, height, positions, tradeDescriptions, showRect = false } = props;

    const scaleX = width / image.width;
    const scaleY = height == undefined ? scaleX : height / image.height;
    const scale = { x: scaleX, y: scaleY };

    return (
      <Stage width={width} height={height ?? image.height * scaleX} ref={ref}>
        <Layer>
          <Group scale={scale}>
            <SrcImage src={image.url} />
            {showRect
              ? positions.map((pos) => {
                  return (
                    <Rect
                      key={pos.id}
                      x={pos.x}
                      y={pos.y}
                      width={pos.width}
                      height={pos.height}
                      fill={"rgba(0, 0, 0, 0.2)"}
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
              const { x, y, width, height } = stampPosition(pos);

              return (
                <SrcImage key={trade.id} src={src} x={x} y={y} width={width} height={height} />
              );
            })}
          </Group>
        </Layer>
      </Stage>
    );
  },
);

KonvaTradeImage.displayName = "KonvaTradeImage";
