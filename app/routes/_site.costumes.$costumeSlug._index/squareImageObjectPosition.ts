import type { ImageDescriptionWithOffset } from "~/utils/types/ImageDescription";

type SquareOffset = NonNullable<ImageDescriptionWithOffset["square"]>;

export const squareImageObjectPosition = ({
  offsetX = 50,
  offsetY = 50,
}: SquareOffset = {}): string => `${offsetX}% ${offsetY}%`;
