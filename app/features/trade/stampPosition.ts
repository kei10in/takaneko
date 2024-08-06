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

  return { x, y, width, height };
};
