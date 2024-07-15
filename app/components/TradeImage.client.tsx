import { Image, Layer, Rect, Stage } from "react-konva";
import useImage from "use-image";
import { ProductImage } from "~/features/productImages";

interface Props {
  productImage: ProductImage;
  showRect?: boolean;
}

export const TradeImage: React.FC<Props> = (props: Props) => {
  const { productImage, showRect = false } = props;

  const [image] = useImage(productImage.url);

  const height = image == undefined ? 0 : (image.height * 600) / image.width;

  const scaleX = image == undefined ? 0 : 600 / image.width;
  const scaleY = image == undefined ? 0 : 800 / image.height;
  const scale = { x: Math.min(scaleX, scaleY), y: Math.min(scaleX, scaleY) };

  return (
    <Stage width={600} height={height}>
      <Layer scale={scale}>
        <Image image={image} />
        {showRect
          ? productImage.positions.map((pos) => {
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
      </Layer>
    </Stage>
  );
};
