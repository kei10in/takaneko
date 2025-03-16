import { dedent } from "ts-dedent";
import { describe, expect, it } from "vitest";
import { アンチファン衣装_生写真 } from "../products/2022/2022-08-08_生写真「アンチファン衣装」";
import { 学生証風_ステッカー } from "../products/2024/2024-04-08_ステッカー「学生証風」";
import { ハニフェス_生写真 } from "../products/2024/2024-04-29_生写真「ハニフェス」";
import { ラブレターカード } from "../products/2025/2025-02-14_ラブレターカード";
import { convertToTradeText } from "./tradeText";

describe("convertToTradeText", () => {
  it("should return formatted trade text for given product and trade descriptions with 'want' status", () => {
    const result = convertToTradeText(アンチファン衣装_生写真, {
      1: { id: 1, status: { tag: "want" } },
      2: { id: 2, status: { tag: "want" } },
      3: { id: 3, status: { tag: "want" } },
      10: { id: 10, status: { tag: "want" } },
    });
    expect(result).toBe(dedent`
      生写真 アンチファン衣装

      💖求
      城月 1, 2, 3
      葉月 10

      `);
  });

  it("should return formatted trade text for given product and trade descriptions with 'have' status", () => {
    const result = convertToTradeText(アンチファン衣装_生写真, {
      1: { id: 1, status: { tag: "have" } },
      2: { id: 2, status: { tag: "have" } },
      3: { id: 3, status: { tag: "have" } },
      10: { id: 10, status: { tag: "have" } },
    });
    expect(result).toBe(dedent`
      生写真 アンチファン衣装

      🎁譲
      城月 1, 2, 3
      葉月 10

      `);
  });

  it("should return formatted trade text for given product and mixed trade descriptions", () => {
    const result = convertToTradeText(アンチファン衣装_生写真, {
      1: { id: 1, status: { tag: "want" } },
      2: { id: 2, status: { tag: "have" } },
      3: { id: 3, status: { tag: "want" } },
      10: { id: 10, status: { tag: "have" } },
    });
    expect(result).toBe(dedent`
      生写真 アンチファン衣装

      💖求
      城月 1, 3

      🎁譲
      城月 2
      葉月 10

      `);
  });

  it("should return only product information if no items match the trade descriptions", () => {
    const result = convertToTradeText(アンチファン衣装_生写真, {
      100: { id: 100, status: { tag: "want" } },
      200: { id: 200, status: { tag: "have" } },
    });
    expect(result).toBe(dedent`
      生写真 アンチファン衣装

      `);
  });

  it("should return formatted trade text for ラブレターカード with 'nameOnly' trade text type", () => {
    const result = convertToTradeText(ラブレターカード, {
      1: { id: 1, status: { tag: "want" } },
      2: { id: 2, status: { tag: "have" } },
      3: { id: 3, status: { tag: "want" } },
      4: { id: 4, status: { tag: "have" } },
    });
    expect(result).toBe(dedent`
      ラブレターカード Cute for life

      💖求
      城月菜央、橋本桃呼

      🎁譲
      涼海すう、葉月紗蘭

      `);
  });

  it("should return formatted trade text for 学生証風_ステッカー with 'description' trade text type", () => {
    const result = convertToTradeText(学生証風_ステッカー, {
      1: { id: 1, status: { tag: "want" } },
      2: { id: 2, status: { tag: "have" } },
      3: { id: 3, status: { tag: "want" } },
      11: { id: 11, status: { tag: "want" } },
      12: { id: 12, status: { tag: "have" } },
      14: { id: 14, status: { tag: "have" } },
    });
    expect(result).toBe(dedent`
      ステッカー 学生証風

      💖求
      城月 真顔, 笑顔
      橋本 真顔

      🎁譲
      涼海 真顔, 笑顔
      葉月 笑顔

      `);
  });

  describe("with ハニフェス 生写真", () => {
    it("should return formatted trade text", () => {
      const result = convertToTradeText(ハニフェス_生写真, {
        1: { id: 1, status: { tag: "want" } },
        2: { id: 2, status: { tag: "have" } },
        3: { id: 3, status: { tag: "want" } },
        11: { id: 11, status: { tag: "want" } },
        12: { id: 12, status: { tag: "have" } },
        14: { id: 14, status: { tag: "have" } },
      });
      expect(result).toBe(dedent`
        生写真 ハニフェス

        💖求
        橋本桃呼、春野莉々、永尾梨央

        🎁譲
        松本ももな、高澤百合愛、福田ひなた

        `);
    });
  });
});
