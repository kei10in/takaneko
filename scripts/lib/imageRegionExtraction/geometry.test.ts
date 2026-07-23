import { describe, expect, it } from "vitest";
import { chooseRepresentativeSize, intersectionOverUnion } from "./geometry";

describe("intersectionOverUnion", () => {
  it("measures overlap independently of rectangle position", () => {
    expect(
      intersectionOverUnion(
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 5, y: 0, width: 10, height: 10 },
      ),
    ).toBeCloseTo(1 / 3);
    expect(
      intersectionOverUnion(
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 20, y: 20, width: 10, height: 10 },
      ),
    ).toBe(0);
  });
});

describe("chooseRepresentativeSize", () => {
  it("selects the size with the least total deviation", () => {
    expect(
      chooseRepresentativeSize([
        { x: 0, y: 0, width: 50, height: 80, boundaryScore: 1 },
        { x: 0, y: 0, width: 51, height: 81, boundaryScore: 1 },
        { x: 0, y: 0, width: 52, height: 82, boundaryScore: 1 },
        { x: 0, y: 0, width: 90, height: 130, boundaryScore: 1 },
      ]),
    ).toEqual({ width: 51, height: 81 });
  });
});
