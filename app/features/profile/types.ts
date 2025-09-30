import { z } from "zod/v4";
import { ImageDescription } from "~/utils/types/ImageDescription";

export const GroupId = z.enum(["高嶺のなでしこ", "高嶺のなでしこ2"]);
export type GroupId = z.infer<typeof GroupId>;

export interface GroupDescription {
  id: GroupId;
  slug: string;
  name: string;
  kana: string;
  romaji: string;
  nickname: string;
  birthday: string;
  nyadeshiko: string;
  hashTag: string;
  hashTagForReply: string;
  idPhoto: ImageDescription;
  image: ImageDescription;
  officialProfile: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  showroom: string;
  members: MemberId[];
}

export const MemberId = z.enum([
  "城月菜央",
  "涼海すう",
  "橋本桃呼",
  "葉月紗蘭",
  "春野莉々",
  "東山恵里沙",
  "日向端ひな",
  "星谷美来",
  "松本ももな",
  "籾山ひめり",
]);

export type MemberId = z.infer<typeof MemberId>;

export interface MemberDescription {
  id: MemberId;
  slug: string;
  number: number;
  name: string;
  kana: string;
  romaji: string;
  nickname: string;
  bloodType: string;
  birthday: string;
  constellation: string;
  birthplace: string;
  color: string;
  memberColor: string;
  fanName: string;
  nyadeshiko: string;
  hashTag: string;
  hashTagForReply: string;
  hashTags?: string[];
  hashTagsForAnnouncement?: string[];
  idPhoto: {
    path: string;
    ref: string;
  };
  image: {
    path: string;
    ref: string;
  };
  officialProfile: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  showroom: string;
}

export const MemberIdOrAll = z.union([z.literal("all"), MemberId]);
export type MemberIdOrAll = z.infer<typeof MemberIdOrAll>;

export const MemberIdOrGroupId = z.union([GroupId, MemberId]);
export type MemberIdOrGroupId = z.infer<typeof MemberIdOrGroupId>;
