import { MemberId, MemberIdOrGroupId } from "~/features/profile/types.ts";
import { ImageDescription } from "~/utils/types/ImageDescription.ts";
import { LinkDescription } from "~/utils/types/LinkDescription.ts";

export interface Publication {
  /** 商品ページの識別子です。他の出版物と重複しない値を指定します。 */
  slug: string;
  /** 正式な誌名・書名です。号数がある場合は含めます。 */
  name: string;
  /** 実際の発売日を YYYY-MM-DD 形式で指定します。号数が示す年月とは区別します。 */
  date: string;
  /** 出版物の種類を指定します。 */
  kind: "magazines" | "books" | "mooks";
  /** 出版社名を指定します。 */
  publisher: string;
  /** 税抜価格を円単位で指定します。 */
  listPrice?: number;
  /** 税込価格を円単位で指定します。 */
  priceWithTax?: number;
  /** ISBN や雑誌コードなどの書誌コードです。 */
  code?: {
    /** コードの種別です。「ISBN」「雑誌コード」などを指定します。 */
    kind: string;
    /** コードの値です。ハイフンや先頭のゼロを含めて文字列で指定します。 */
    value: string;
  }[];
  /** 出版物の商品ページの URL を指定します。 */
  url: string;
  /**
   * 表紙・裏表紙・特別版の表紙と裏表紙・特典・アナザーカットやオフショットの順に指定します。
   * 各画像の path は公開画像のパス、ref は出典 URL です。
   */
  coverImages: ImageDescription[];
  /**
   * 電子版の有無を boolean、または電子版へのリンクの配列で指定します。
   * 電子版のみの出版物場合は必ず指定します。省略は電子版がないことを意味しません。
   */
  ebooks?: boolean | LinkDescription[];
  /** 購入特典の一覧です。 */
  bonuses?: {
    /** 特典の名称です。 */
    name: string;
    /** 「店舗限定特典」など、特典の区分です。 */
    category?: string;
    /** 特典を取り扱う店舗の商品ページ URL です。 */
    store?: string;
  }[];
  /** 掲載対象のメンバーまたは体制を ID で指定します。 */
  featuredMembers: MemberIdOrGroupId[];
  /** featuredMembers で指定したグループのうち、掲載されないメンバーを指定します。 */
  absent?: MemberId[];
  /** 公式 X の告知ポストの URL を指定します。 */
  officialTwitter?: string | string[];
  /** 掲載内容の紹介など、関連情報へのリンクです。 */
  links?: LinkDescription[];
}

export interface Newspaper {
  /** 新聞掲載情報の識別子です。他の掲載情報と重複しない値を指定します。 */
  slug: string;
  /** 新聞名と掲載日などを含む名称です。 */
  name: string;
  /** 掲載号の発行日を YYYY-MM-DD 形式で指定します。 */
  date: string;
  /** 新聞を表す newspapers を指定します。 */
  kind: "newspapers";
  /** 発行元の新聞社名です。 */
  publisher: string;
  /** 掲載内容についての補足です。 */
  notes?: string;
  /** 掲載対象のメンバー名やグループ名です。 */
  featuredMembers: string[];
  /** 公式 X の告知ポストの URL です。 */
  officialTwitter?: string;
  /** 掲載内容の紹介など、関連情報へのリンクです。 */
  links?: LinkDescription[];
}
