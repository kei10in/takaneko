import { describe, expect, it } from "vitest";
import {
  Stamp,
  tradeStateToImageSrc,
  TradeStatusHaveCounts,
  TradeStatusMaxHaveCount,
} from "./TradeStatus";

describe("tradeStateToImageSrc", () => {
  it.each(TradeStatusHaveCounts)("数字スタンプ %i の画像パスを返す", (count) => {
    expect(tradeStateToImageSrc({ tag: "have", count })).toBe(`/${count}.svg`);
  });
});

describe("Stamp.increment", () => {
  it("数字スタンプを 12 まで増やせる", () => {
    expect(Stamp.increment({ tag: "have", count: 6 })).toEqual({ tag: "have", count: 7 });
    expect(Stamp.increment({ tag: "have", count: 11 })).toEqual({
      tag: "have",
      count: TradeStatusMaxHaveCount,
    });
  });

  it("数字スタンプは 12 を超えない", () => {
    expect(Stamp.increment({ tag: "have", count: TradeStatusMaxHaveCount })).toEqual({
      tag: "have",
      count: TradeStatusMaxHaveCount,
    });
  });
});
