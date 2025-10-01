import { z } from "zod/v4";
import { ImageDescription } from "~/utils/types/ImageDescription";

export const GroupIdEnum = z.enum([
  // 10 人体制の高嶺のなでしこ
  "高嶺のなでしこ",
  // 9 人体制の高嶺のなでしこ。2025-08-01 以降
  "高嶺のなでしこ2",
]);

export const GroupId = GroupIdEnum.enum;
export type GroupId = z.infer<typeof GroupIdEnum>;

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

export const MemberIdEnum = z.enum([
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

export const MemberId = MemberIdEnum.enum;
export type MemberId = z.infer<typeof MemberIdEnum>;

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

export const MemberIdOrAll = z.union([z.literal("all"), MemberIdEnum]);
export type MemberIdOrAll = z.infer<typeof MemberIdOrAll>;

export const MemberIdOrGroupId = z.union([GroupIdEnum, MemberIdEnum]);
export type MemberIdOrGroupId = z.infer<typeof MemberIdOrGroupId>;
