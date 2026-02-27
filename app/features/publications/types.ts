import { MemberId, MemberIdOrGroupId } from "~/features/profile/types";
import { ImageDescription } from "~/utils/types/ImageDescription";
import { LinkDescription } from "~/utils/types/LinkDescription";

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
  featuredMembers: MemberIdOrGroupId[];
  absent?: MemberId[];
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
