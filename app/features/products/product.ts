export interface ImageDescription {
  path: string;
  ref: string;
}

export interface LinkDescription {
  text: string;
  url: string;
}

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
  images: ImageDescription[];
  goods: { type: string; items: (string | ProductImage)[] }[];
}

export interface PublicationDescription {
  id: string;
  name: string;
  date: string;
  kind: "magazines" | "books";
  publisher: string;
  list_price?: number;
  code?: { kind: string; value: string }[];
  url: string;
  cover_images: ImageDescription[];
  featured_members: string[];
  official_x?: string;
  links?: LinkDescription[];
}
