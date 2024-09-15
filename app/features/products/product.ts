export type ProductDescription = ProductImage;

export interface ProductImage {
  id: string;
  name: string;
  year: number;
  series: string;
  kind: string;
  url: string;
  width: number;
  height: number;
  photos: PhotoDescription[];
  positions: ImagePosition[];
}

export interface PhotoDescription {
  id: number;
  name: string;
  description?: string;
}

export interface ImagePosition {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LiveGoodsDescription {
  id: string;
  name: string;
  image: {
    path: string;
    ref: string;
  };
  goods: { type: string; items: string[] }[];
}
