import { MemberName } from "~/features/profile/types";
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
  priceWithTax?: number;
  images?: ImageDescription[];
}

export const ProductLine = {
  Photo: "生写真セット",
  MiniPhotoCard: "ミニフォトカードセット",
} as const;

export type ProductLine = (typeof ProductLine)[keyof typeof ProductLine];

export const TradeTextType = {
  Description: "description",
  GroupByDescription: "groupByDescription",
  NameOnly: "nameOnly",
  Numbering: "numbering",
} as const;

export type TradeTextType = (typeof TradeTextType)[keyof typeof TradeTextType];

/**
 * ランダムグッズを表します。
 *
 * シリアライズ可能である必要があります。
 */
export interface RandomGoods {
  // 複数の `RandomGoods の中から一意に識別するために使用します。
  id: string;
  // URL の path part に使用します。
  // 歴史的には `id` が path part に使われていましたが、`id` には path path には
  // 適さない文字が含まれていまいした。しかし `id` は変更しては問題が起きる使わ
  // れ方をしていたため `slug` が導入されました。
  // 新たに `RandomGoods` のオブジェクトを定義する場合は `id` は `slug` と同じ
  // 値にします。
  slug: string;

  name: string;
  abbrev?: string;
  date?: string;
  listPrice?: number;
  priceWithTax?: number;
  images?: ImageDescription[];
  year: number;
  // 生写真セット・ミニフォトカードセットだけに設定する値です。
  set?: { kind: ProductLine; setName: string } | undefined;
  series: string;
  category: string;

  tradeTitle?: string;
  tradeText?: TradeTextType;

  variants: ItemDescription[];

  // 画像に関する情報です。
  url: string;
  width: number;
  height: number;
  withFrame?: boolean;
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
  kind: "magazines" | "books" | "mooks";
  publisher: string;
  listPrice?: number;
  priceWithTax?: number;
  code?: { kind: string; value: string }[];
  url: string;
  coverImages: ImageDescription[];
  ebooks?: boolean | LinkDescription[];
  bonuses?: {
    name: string;
    category?: string;
    store?: string;
  }[];
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
  date: string;
  memberName: MemberName;
  images: ImageDescription[];
  lineup: OfficialGoods[];
}
