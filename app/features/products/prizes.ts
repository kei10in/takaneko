import { ImageDescription } from "~/utils/types/ImageDescription";

export interface PrizeDrawing {
  id: string;
  name: string;
  images: ImageDescription[];
  prizes: {
    rank: string;
    name: string;
    prizeId?: string;
    quantity?: string | number | undefined;
  }[];
}

export interface Prize {
  id: string;
  name: string;
  prizeDrawings: string[];
  signed?: boolean;
}
