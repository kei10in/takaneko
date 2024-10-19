import { MemberName } from "~/routes/members/members";
import { ImageDescription } from "~/utils/types/ImageDescription";
import { LinkDescription } from "~/utils/types/LinkDescription";

export type ProductDescription =
  | {
      kind: "images";
      description: ProductImage;
    }
  | {
      kind: "publications";
      description: PublicationDescription;
    };

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

export interface BirthdayGoodsDescription {
  id: string;
  name: string;
  memberName: MemberName;
  goods: string[];
  images: ImageDescription[];
}

export interface PublicationDescription {
  id: string;
  name: string;
  date: string;
  kind: "magazines" | "books";
  publisher: string;
  listPrice?: number;
  code?: { kind: string; value: string }[];
  url: string;
  coverImages: ImageDescription[];
  featuredMembers: MemberName[];
  officialTwitter?: string;
  links?: LinkDescription[];
}

export interface NewspaperDescription {
  id: string;
  name: string;
  date: string;
  kind: "newspapers";
  publisher: string;
  notes?: string;
  featuredMembers: string[];
  officialTwitter?: string;
  links?: LinkDescription[];
}

export interface OfficialGoodsDescription {
  id: string;
  name: string;
  date: string;
  listPrice: number;
  images: ImageDescription[];
}
