import { ImagePosition } from "../products/product";

interface Xywh {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const stampPositions = (positions: ImagePosition[]): ImagePosition[] => {
  const minWidth = Math.min(...positions.map((p) => p.width));

  return positions.map((selPosition) => {
    const x = selPosition.x;
    const y = selPosition.y;
    const width = selPosition.width;
    const height = selPosition.height;

    const stampPos = stampPosition(minWidth, { x, y, width, height });

    return { id: selPosition.id, ...stampPos };
  });
};

export const stampPosition = (baseSize: number, target: Xywh): Xywh => {
  const width = baseSize / 1.5;
  const height = baseSize / 1.5;
  const x = target.x + target.width / 2 - width / 2;
  const y = target.y + target.height - height;

  if (target.height < height * 1.75) {
    return stampPositionForSquare(baseSize, target);
  }

  return { x, y, width, height };
};

const stampPositionForSquare = (baseSize: number, target: Xywh): Xywh => {
  const width = baseSize / 2.25;
  const height = width;
  const x = target.x + target.width - width;
  const y = target.y + target.height - height;

  return { x, y, width, height };
};
