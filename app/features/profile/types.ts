import { z } from "zod/v4";

export const MemberName = z.union([
  z.literal("城月菜央"),
  z.literal("涼海すう"),
  z.literal("橋本桃呼"),
  z.literal("葉月紗蘭"),
  z.literal("春野莉々"),
  z.literal("東山恵里沙"),
  z.literal("日向端ひな"),
  z.literal("星谷美来"),
  z.literal("松本ももな"),
  z.literal("籾山ひめり"),
]);

export type MemberName = z.infer<typeof MemberName>;

export const MemberNameOrGroup = z.union([z.literal("高嶺のなでしこ"), MemberName]);
export type MemberNameOrGroup = z.infer<typeof MemberNameOrGroup>;

export interface MemberDescription {
  id: MemberName;
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
