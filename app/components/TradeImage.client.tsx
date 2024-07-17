import { Group, Image, Layer, Rect, Stage } from "react-konva";
import useImage from "use-image";
import { ImagePosition } from "~/features/productImages";
import { TradeState } from "~/features/TradeState";
import { SrcImage } from "./SrcImage";

interface Props {
  url: string;
  positions: ImagePosition[];
  tradeDescriptions: { id: number; state: TradeState }[];
  showRect?: boolean;
  children?: (scale: number) => React.ReactNode;
}

export const TradeImage: React.FC<Props> = (props: Props) => {
  const { url, positions, tradeDescriptions, showRect = false, children } = props;

  const [image] = useImage(url);

  if (image == undefined) {
    return null;
  }
  const width = 390;
  const height = (image.height * width) / image.width;

  const scaleF = width / image.width;
  const scale = { x: scaleF, y: scaleF };

  return (
    <div className="w-full overflow-hidden">
      <div className="grid h-fit w-full grid-cols-1 grid-rows-1">
        <Stage width={width} height={height} className="col-start-1 row-start-1">
          <Layer>
            <Group scale={scale}>
              <Image image={image} />
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

                const src = selectSrc(trade.state);
                const width = pos.width / 1.5;
                const height = width;
                const x = pos.x + pos.width / 2 - width / 2;
                const y = pos.y + pos.height - height - 5;

                return (
                  <SrcImage key={trade.id} src={src} x={x} y={y} width={width} height={height} />
                );
              })}
            </Group>
          </Layer>
        </Stage>
        {/* Overlay to enable touch events. The <canvas> element disables default pan
          behavior, so this overlay ensures touch events pass through. --> */}
        <div style={{ width, height }} className="z-0 col-start-1 row-start-1">
          {children?.(scaleF)}
        </div>
      </div>
    </div>
  );
};

const selectSrc = (trade: TradeState): string | undefined => {
  if (trade.tag == "want") {
    return "/求.svg";
  } else if (trade.tag == "have") {
    if (trade.count == undefined) {
      return "/譲.svg";
    } else if (trade.count < 1) {
      return "/譲.svg";
    } else if (trade.count == 1) {
      return "/1.svg";
    } else if (trade.count == 2) {
      return "/2.svg";
    } else if (trade.count == 3) {
      return "/3.svg";
    } else if (trade.count == 4) {
      return "/4.svg";
    } else if (trade.count == 5) {
      return "/5.svg";
    } else if (trade.count >= 6) {
      return "/6.svg";
    }
  }

  return undefined;
};
