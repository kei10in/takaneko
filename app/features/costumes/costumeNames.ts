import { z } from "zod/v4";

export const StageCostumeName = z.enum([
  "Bouquet of 9 Flowers 衣装",
  "見上げるたびに、恋をする。衣装",
  "2025 夏衣装",
  "アイドル衣装衣装",
  "2025 春衣装",
  "ピンク衣装",
  "高嶺のなでしこ 2024 衣装",
  "I’M YOUR IDOL 衣装",
  "わたし色に染まれ衣装",
  "美しく生きろ衣装 (ジャケットなし)",
  "美しく生きろ衣装",
  "僕は君になれない衣装",
  "全国お招きツアー衣装",
  "アンチファン衣装",
]);

export type StageCostumeName = z.infer<typeof StageCostumeName>;
export const StageCostumeNames: string[] = StageCostumeName.options;

export const MvCostumeName = z.enum([
  "「私は、わたしの事が好き。」MV 衣装",
  "「病名恋ワズライ」衣装",
  "「この世界は嘘でできている」白衣装",
  "「この世界は嘘でできている」黒衣装",
  "「この世界は嘘でできている」私服衣装",
  "「ライフクエスト」お仕事衣装",
  "「ライフクエスト」部屋着衣装",
  "「初恋のこたえ。」浴衣衣装",
  "「アイドル衣装」白衣装",
  "「メランコリックハニー」MV 衣装",
  "「Cute for life」私服衣装",
  "「東京サニーパーティー」制服衣装",
  "「東京サニーパーティー」パジャマ衣装",
  "「小悪魔だってかまわない」衣装",
  "「I’M YOUR IDOL」MV 衣装",
  "「アドレナリンゲーム」白黒衣装",
  "「アドレナリンゲーム」ジャージ",
  "「死ぬまでダーリン」MV 部屋着",
  "「死ぬまでダーリン」MV アイドル衣装",
  "「死ぬまでダーリン」MV デート私服",
  "「LOVE ANTHEM」MV 衣装",
  "「モテチェン！」MV 制服衣装",
  "モテチェン！ MV 衣装",
  "「私より好きでいて」MV 衣装",
  "「メイド☆至上主義」衣装",
  "「推しの魔法」MV 衣装",
  "「私は怪物」MV 衣装",
  "「可愛いって言われたい」MV パンクロック衣装",
  "「可愛いって言われたい」MV もこもこ帽子衣装",
  "「可愛いって言われたい」MV 虹色衣装",
  "「いつか私がママになったら」MV ワンピース衣装",
  "「17歳」MV 衣装",
  "「すきっちゅーの！」私服衣装",
  "「すきっちゅーの！」パジャマ衣装",
  "「月曜日の憂鬱」MV 衣装",
  "「決戦スピリット」MV 衣装",
  "「革命の女王」黒衣装",
  "「革命の女王」ダンスプラクティス衣装",
  "「僕は君になれない」私服衣装",
  "「僕は君になれない」ダンスプラクティス衣装",
  "「男の子の目的は何？」MV 衣装",
  "可愛くてごめん MV 衣装",
  "「可愛くてごめん」パジャマ衣装",
  "「ユメムスビ」MV 衣装",
]);

export type MvCostumeName = z.infer<typeof MvCostumeName>;
export const MvCostumeNames: string[] = MvCostumeName.options;

export const UniformCostumeName = z.enum([
  "「世界は恋に落ちている」制服衣装",
  "「ハニフェス 2025」制服衣装",
  "ホワイトチョコ・ビターチョコ制服衣装",
  "「アイのウイルス」制服衣装",
  "「I’M YOUR IDOL」MV 衣装",
  "「アドレナリンゲーム」MV 衣装",
  "「モテチェン！」MV 衣装",
  "「センパイ。」制服衣装",
  "「恋を知った世界」制服衣装",
  "「いつか私がママになったら」制服衣装",
  "「初恋のひと。」制服衣装",
  "「ヒロインは平均以下。」制服衣装",
  "「女の子は強い」制服衣装",
  "「可愛くてごめん」MV 衣装",
  "「乙女どもよ。」制服衣装",
]);

export type UniformCostumeName = z.infer<typeof UniformCostumeName>;
export const UniformCostumeNames: string[] = UniformCostumeName.options;

export const TShirtCostumeName = z.enum([
  "T シャツ (Bouquet of 9 Flowers 台北限定 ver.)",
  "T シャツ (Bouquet of 9 Flowers 韓国限定 ver.)",
  "T シャツ (Bouquet of 9 Flowers ver.)",
  "T シャツ (ハニフェス 2025)",
  "T シャツ (Spring Ride ver.)",
  "T シャツ (瞬きさえ忘れる。 ver.)",
  "T シャツ (2nd ファンミ ver.)",
  "T シャツ (わたし色に染まれ ver.)",
  "T シャツ (Beginning ver.)",
  "T シャツ (CONTEMPO ver.)",
  "T シャツ (たかねこちゃん個別デザイン)",
  "T シャツ (たかねこ全国お招きツアー 2023)",
  "T シャツ (高嶺のなでしこ ver.)",
  "T シャツ (メンバー個別名前入り)",
]);

export type TShirtCostumeName = z.infer<typeof TShirtCostumeName>;
export const TShirtCostumeNames: string[] = TShirtCostumeName.options;

export const SpecialCostumeName = z.enum([
  "超かぐや姫！コスプレ衣装",
  "アクロトーキョー ツーショット撮影会衣装",
  "アクロトーキョー コラボグッズ衣装",
  "高嶺のなでしこ 2024 衣装 + 茨城ロボッツ 2025-26 ユニフォーム",
  "高嶺のなでしこ 2024 衣装 + 川崎ブレイブ・サンダース 2025-26 ユニフォーム",
  "クリスマス 2025 衣装",
  "高嶺のなでしこ×michellMacaron コラボアイテム",
  "たかねこハロウィン2025 探偵衣装",
  "LARME Fes'25 衣装",
  "高嶺のなでしこ 2024 衣装 + 24時間テレビ 2025 Tシャツ",
  "2025 浴衣",
  "パジャマ",
  "LARME×高嶺のなでしこ SPECIAL COLLABORATION 衣装",
  "高嶺のなでしこ 2024 衣装 + 茨城ロボッツ ユニフォーム",
  "高嶺のなでしこ 2024 衣装 + 川崎ブレイブ・サンダース ユニフォーム",
  "ホワイトチョコ・ビターチョコ制服衣装",
  "バレンタイン 2025 衣装", // Cute for Life のときの衣装。生写真の衣装とは別もの。
  "クリスマス 2024 衣装",
  "キュンキュン学園制服",
  "T シャツ (瞬きさえ忘れる ver.) + コーチジャケット (瞬きさえ忘れる ver.)",
  "LARME fes vol.1 衣装",
  "読売ジャイアンツ ユニフォーム",
  "京れもん 着物",
  "ホワイトサンタ 2023 衣装",
  "T シャツ (MILK JAPAN)",
  "2022 サンタ衣装",
  "ハロウィンコスプレ🎃",
]);

export type SpecialCostumeName = z.infer<typeof SpecialCostumeName>;
export const SpecialCostumeNames: string[] = SpecialCostumeName.options;

export const UncategorizedCostumeName = z.enum(["生誕グッズ衣装", "私服"]);

export const CostumeName = z.enum({
  ...StageCostumeName.enum,
  ...UniformCostumeName.enum,
  ...MvCostumeName.enum,
  ...TShirtCostumeName.enum,
  ...SpecialCostumeName.enum,
  ...UncategorizedCostumeName.enum,
});
export type CostumeName = z.infer<typeof CostumeName>;

export const AllCostumeNames: string[] = CostumeName.options;
