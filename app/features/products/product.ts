export type ProductDescription = ProductImage;

export interface ProductImage {
  id: string;
  year: number;
  name: string;
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
