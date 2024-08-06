interface Xywh {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const stampPosition = (target: Xywh): Xywh => {
  const width = target.width / 1.5;
  const height = width;
  const x = target.x + target.width / 2 - width / 2;
  const y = target.y + target.height - height;

  if (target.height < height * 1.75) {
    return stampPositionForSquare(target);
  }

  return { x, y, width, height };
};

const stampPositionForSquare = (target: Xywh): Xywh => {
  const width = target.width / 2.25;
  const height = width;
  const x = target.x + target.width - width;
  const y = target.y + target.height - height;

  return { x, y, width, height };
};
