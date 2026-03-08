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
