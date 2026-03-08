import { z } from "zod/v4";
import { EventTypeEnum, LiveTypeEnum } from "../events/EventType";

export type PhotoType = "artist" | "press" | "none";

/**
 * ステージ衣装です。
 * ワンマンライブやイベントで着用される衣装です。
 * ステージ衣装は、写真撮影の際に、アーティスト写真として撮影されることが多いです。
 * ステージ衣装にはその使われ方から主に 3 つのタイプがあります。
 *   - アーティスト写真に加えてメディア掲載用にも使われるもの
 *   - アーティスト写真として使用されるもの
 *   - 写真撮影されないもの
 */
export interface StageCostume {
  kind: "stage";
  name: string;
  slug: string;

  photoType: PhotoType;

  stylist?: string;
}

/**
 * 制服ベースの衣装です。
 * 制服衣装は MV 衣装と分けています。
 * 制服衣装は、ワンマンライブでも着用されることが多いので、MV 衣装とは別に管理します。
 * またリボンなどの小物によるバリエーションがあります。
 */
export interface UniformCostume {
  kind: "uniform";
  name: string;
}

export interface MvCostume {
  kind: "mv";
  name: string;
}

/**
 * 高野のなでしこの T シャツです。
 * 販売されていないものも含まれています。
 */
export interface TShirtCostume {
  kind: "tshirt";
  name: string;
}

export interface SpecialCostume {
  kind: "special";
  name: string;
}

export type Costume = StageCostume | MvCostume | TShirtCostume | SpecialCostume;

/**
 * 特定の衣装が着用された公演の概要情報を表します。
 */
export const SimpleCostumeActivity = z.object({
  event: z.object({
    slug: z.string(),
    summary: z.string(),
    title: z.string(),
    category: EventTypeEnum,
    liveType: LiveTypeEnum.optional(),
    date: z.string(),
    region: z.string().optional(),
    location: z.string().optional(),
  }),
  acts: z.array(
    z.object({
      // 一公演しかない場合、actTitle が undefined になります。
      actTitle: z.string().optional(),
      // TODO: section に対応する。セットリストのパースから変える必要がある。
      // section: z.enum(["main", "encore"]),
    }),
  ),
});

export type SimpleCostumeActivity = z.output<typeof SimpleCostumeActivity>;

export const LivesForCostume = z.object({
  costumeSlug: z.string(),
  costumeName: z.string(),
  count: z.int(),
  lives: z.array(SimpleCostumeActivity),
});

export type LivesForCostume = z.output<typeof LivesForCostume>;
