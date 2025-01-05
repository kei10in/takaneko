import { MemberName } from "~/routes/members/members";
import { ImageDescription } from "~/utils/types/ImageDescription";
import { LinkDescription } from "~/utils/types/LinkDescription";

export type Product =
  | {
      kind: "images";
      description: RandomGoods;
    }
  | {
      kind: "publications";
      description: Publication;
    };

export interface OfficialGoods {
  slug: string;
  name: string;
  date?: string;
  description?: string;
  listPrice?: number;
  images?: ImageDescription[];
}

/**
 * ランダムグッズを表します。
 *
 * シリアライズ可能である必要があります。
 */
export interface RandomGoods {
  id: string;
  slug: string;
  name: string;
  date?: string;
  listPrice?: number;
  images?: ImageDescription[];
  year: number;
  series: string;
  category: string;
  url: string;
  width: number;
  height: number;
  lineup: ItemDescription[];
  positions: ImagePosition[];
}

export interface ItemDescription {
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

export interface Publication {
  slug: string;
  name: string;
  date: string;
  kind: "magazines" | "books";
  publisher: string;
  listPrice?: number;
  code?: { kind: string; value: string }[];
  url: string;
  coverImages: ImageDescription[];
  ebooks?: boolean | LinkDescription[];
  bonuses?: [
    {
      name: string;
      category?: string;
      store?: string;
    },
  ];
  featuredMembers: MemberName[];
  officialTwitter?: string | string[];
  links?: LinkDescription[];
}

export interface Newspaper {
  slug: string;
  name: string;
  date: string;
  kind: "newspapers";
  publisher: string;
  notes?: string;
  featuredMembers: string[];
  officialTwitter?: string;
  links?: LinkDescription[];
}

/**
 * ライブグッズ。
 * 物販だけでなく抽選会やライブ中にプレゼントされたものを含みます。
 */
export interface LiveGoodsCollection {
  slug: string;
  name: string;
  images: ImageDescription[];
  goods: { type: string; lineup: (string | RandomGoods)[] }[];
}

/**
 * 誕生日記念グッズ。
 */
export interface BirthdayGoodsCollection {
  slug: string;
  name: string;
  memberName: MemberName;
  images: ImageDescription[];
  lineup: OfficialGoods[];
}
