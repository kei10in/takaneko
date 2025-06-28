import { z } from "zod";

export const StageCostumes = z.enum([
  "アイドル衣装衣装",
  "2025 春衣装",
  "ピンク衣装",
  "高嶺のなでしこ 2024 衣装",
  "I’M YOUR IDOL 衣装",
  "わたし色に染まれ衣装",
  "美しく生きろ衣装",
  "僕は君になれない衣装",
  "全国お招きツアー衣装",
  "アンチファン衣装",
]);

export type StageCostumes = z.infer<typeof StageCostumes>;
export const StageCostumeNames: string[] = StageCostumes.options;

export const MvCostumes = z.enum([
  "アイのウイルス制服衣装",
  "I’M YOUR IDOL MV 衣装",
  "アドレナリンゲーム MV 衣装",
  "センパイ。制服衣装",
  "恋を知った世界制服衣装",
  "初恋のひと。制服衣装",
  "ヒロインは平気以下。制服衣装",
  "女の子は強い制服衣装",
  "乙女どもよ。制服衣装",
]);

export type MvCostumes = z.infer<typeof MvCostumes>;
export const MvCostumeNames: string[] = MvCostumes.options;

export const SpecialCostumeNames = ["ハロウィンコスプレ🎃"];
