import { describe, expect, it } from "vitest";
import type { ClusteredRect } from "../imageRegionExtraction/types";
import { inferCatalogGrid } from "./catalogGrid";

const createRow = (row: number, y: number, columns: number[]): ClusteredRect[] =>
  columns.map((column) => ({
    x: 40 + column * 190,
    y,
    width: 160,
    height: 220,
    boundaryScore: 0.5,
    row,
    column,
  }));

describe("inferCatalogGrid", () => {
  it("excludes a header-like row that does not belong to the dominant grid", () => {
    const header = Array.from({ length: 12 }, (_, column) => ({
      x: 10 + column * 95,
      y: 20,
      width: 80,
      height: 120,
      boundaryScore: 0.5,
      row: 0,
      column,
    }));
    const cards = [240, 500, 760, 1020, 1280].flatMap((y, row) =>
      createRow(row + 1, y, row === 4 ? [0, 1, 2] : [0, 1, 2, 3, 4, 5]),
    );

    const grid = inferCatalogGrid([...header, ...cards]);

    expect(grid).toEqual({
      rows: 5,
      columns: 6,
      rects: cards.map((rect) => ({ ...rect, row: rect.row - 1 })),
    });
  });

  it("chooses the regular row suffix when the header has card-like columns", () => {
    const header = createRow(0, 20, [0, 1, 2, 3, 4, 5]);
    const cards = [300, 560, 820, 1080].flatMap((y, row) =>
      createRow(row + 1, y, [0, 1, 2, 3, 4, 5]),
    );

    const grid = inferCatalogGrid([...header, ...cards]);

    expect(grid?.rects).toEqual(cards.map((rect) => ({ ...rect, row: rect.row - 1 })));
  });
});
