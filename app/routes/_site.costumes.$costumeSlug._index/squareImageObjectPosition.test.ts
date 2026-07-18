import { describe, expect, it } from "vitest";
import { squareImageObjectPosition } from "./squareImageObjectPosition";

describe("squareImageObjectPosition", () => {
  it("uses the center for unspecified axes", () => {
    expect(squareImageObjectPosition()).toBe("50% 50%");
    expect(squareImageObjectPosition({ offsetX: 25 })).toBe("25% 50%");
    expect(squareImageObjectPosition({ offsetY: 75 })).toBe("50% 75%");
  });

  it("aligns zero to the top or left and 100 to the bottom or right", () => {
    expect(squareImageObjectPosition({ offsetX: 0, offsetY: 0 })).toBe("0% 0%");
    expect(squareImageObjectPosition({ offsetX: 100, offsetY: 100 })).toBe("100% 100%");
  });
});
