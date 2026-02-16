import { z } from "zod/v4";

export const StageCostumes = z.enum([
  "Bouquet of 9 Flowers 衣装",
  "見上げるたびに、恋をする。衣装",
  "2025 夏衣装",
  "アイドル衣装衣装",
  "2025 春衣装",
  "ピンク衣装",
  "高嶺のなでしこ 2024 衣装",
  "I’M YOUR IDOL 衣装",
  "わたし色に染まれ衣装",
  "美しく生きろ衣装 (上着なし)",
  "美しく生きろ衣装",
  "僕は君になれない衣装",
  "全国お招きツアー衣装",
  "アンチファン衣装",
]);

export type StageCostumes = z.infer<typeof StageCostumes>;
export const StageCostumeNames: string[] = StageCostumes.options;

export const MvCostumes = z.enum([
  "ハニフェス 2025 制服衣装",
  "ホワイトチョコ・ビターチョコ制服衣装",
  "アイのウイルス制服衣装",
  "I’M YOUR IDOL MV 衣装",
  "アドレナリンゲーム MV 衣装",
  "モテチェン！ MV 衣装",
  "センパイ。制服衣装",
  "恋を知った世界制服衣装",
  "初恋のひと。制服衣装",
  "ヒロインは平気以下。制服衣装",
  "女の子は強い制服衣装",
  "可愛くてごめん MV 衣装",
  "乙女どもよ。制服衣装",
]);

export type MvCostumes = z.infer<typeof MvCostumes>;
export const MvCostumeNames: string[] = MvCostumes.options;

export const TShirtCostumes = z.enum([
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

export type TShirtCostumes = z.infer<typeof TShirtCostumes>;
export const TShirtCostumeNames: string[] = TShirtCostumes.options;

export const SpecialCostumeNames = [
  "クリスマス 2025 衣装",
  "たかねこハロウィン2025 探偵衣装",
  "LARME Fes'25 衣装",
  "高嶺のなでしこ 2024 衣装 + 24時間テレビ 2025 Tシャツ",
  "2025 浴衣",
  "パジャマ",
  "高嶺のなでしこ 2024 衣装 + 茨城ロボッツ ユニフォーム",
  "高嶺のなでしこ 2024 衣装 + 川崎ブレイブ・サンダース ユニフォーム",
  "ホワイトチョコ・ビターチョコ制服衣装",
  "バレンタイン 2025 衣装",
  "クリスマス 2024 衣装",
  "キュンキュン学園制服",
  "LARME fes vol.1 衣装",
  "読売ジャイアンツ ユニフォーム",
  "京れもん 着物",
  "ホワイトサンタ 2023 衣装",
  "T シャツ (MILK JAPAN)",
  "2022 サンタ衣装",
  "ハロウィンコスプレ🎃",
];
