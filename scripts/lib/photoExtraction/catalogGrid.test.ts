import { describe, expect, it } from "vitest";
import type { ClusteredRect, LayoutCandidate } from "../imageRegionExtraction/types";
import {
  chooseCatalogFrameWidth,
  inferCatalogGrid,
  reconstructSparseCatalogGrid,
  regularizeCatalogColumns,
} from "./catalogGrid";

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

describe("regularizeCatalogColumns", () => {
  it("replaces column outliers with the dominant positions across complete rows", () => {
    const rows = [
      { name: "first", columns: [44, 316, 555, 828, 1098, 1403] },
      { name: "second", columns: [44, 316, 587, 859, 1131, 1403] },
      { name: "third", columns: [44, 316, 587, 859, 1107, 1403] },
      { name: "fourth", columns: [44, 316, 587, 859, 1131, 1368] },
      { name: "fifth", columns: [44, 316, 587, 859, 1131, 1368] },
    ];

    expect(regularizeCatalogColumns(rows, 6, 235)).toEqual([
      { name: "first", columns: [44, 316, 587, 859, 1131, 1403] },
      { name: "second", columns: [44, 316, 587, 859, 1131, 1403] },
      { name: "third", columns: [44, 316, 587, 859, 1131, 1403] },
      { name: "fourth", columns: [44, 316, 587, 859, 1131, 1403] },
      { name: "fifth", columns: [44, 316, 587, 859, 1131, 1403] },
    ]);
  });

  it("preserves small variations and incomplete rows", () => {
    const rows = [
      { name: "first", columns: [44, 316, 587, 859, 1131, 1403] },
      { name: "second", columns: [48, 312, 590, 856, 1135, 1399] },
      { name: "third", columns: [40, 320, 583, 863, 1127, 1407] },
      { name: "partial", columns: [44, 316, 587] },
    ];

    expect(regularizeCatalogColumns(rows, 6, 235)).toEqual(rows);
  });
});

describe("chooseCatalogFrameWidth", () => {
  it("uses the smaller width when the one-pixel difference repeats across a quarter of frames", () => {
    const rects = [
      ...Array.from({ length: 9 }, () => ({ width: 234 })),
      ...Array.from({ length: 19 }, () => ({ width: 235 })),
    ];

    expect(chooseCatalogFrameWidth(rects)).toBe(234);
  });

  it("preserves the representative width when smaller frames are a minority", () => {
    const rects = [
      ...Array.from({ length: 5 }, () => ({ width: 234 })),
      ...Array.from({ length: 20 }, () => ({ width: 235 })),
    ];

    expect(chooseCatalogFrameWidth(rects)).toBe(235);
  });
});

describe("reconstructSparseCatalogGrid", () => {
  it("reconstructs missing rows and columns from a partial grid spread across the catalog", () => {
    const createRect = (x: number, y: number, width: number, height: number) => ({
      x,
      y,
      width,
      height,
      boundaryScore: 0.5,
      row: 0,
      column: 0,
    });
    const partial: LayoutCandidate = {
      rects: [
        createRect(40, 180, 160, 220),
        createRect(420, 180, 160, 220),
        createRect(800, 180, 160, 220),
        createRect(230, 430, 160, 220),
        createRect(610, 430, 160, 220),
        createRect(40, 930, 160, 220),
        createRect(420, 930, 160, 220),
        createRect(800, 930, 160, 220),
      ],
      rows: 3,
      columns: 5,
      score: 0.65,
      alignment: "global-grid",
    };
    const decoy: LayoutCandidate = {
      rects: [102, 361, 610, 868].map((x) => createRect(x, 61, 76, 104)),
      rows: 1,
      columns: 4,
      score: 0.75,
      alignment: "global-grid",
    };

    const grid = reconstructSparseCatalogGrid([decoy, partial], 1000, 1200);

    expect(grid?.rows).toBe(4);
    expect(grid?.columns).toBe(5);
    expect([...new Set(grid?.rects.map(({ x }) => x))]).toEqual([40, 230, 420, 610, 800]);
    expect([...new Set(grid?.rects.map(({ y }) => y))]).toEqual([180, 430, 680, 930]);
  });
});
