import { dedent } from "ts-dedent";
import { describe, expect, it } from "vitest";
import { アンチファン衣装_生写真 } from "../products/2022/2022-08-08_生写真「アンチファン衣装」";
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
});
