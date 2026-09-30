import { describe, expect, it } from "vitest";
import { AllStageCostumes } from "~/features/costumes/costumesStage.ts";
import { PerformedSongs } from "~/features/songs/songsFiltered.ts";
import { defaultSetlistSearchFilters, SetlistSearchFilters } from "./searchFilters.ts";
import { readSetlistSearchParams, writeSetlistSearchParams } from "./searchParams.ts";

describe("セットリストの検索パラメーター", () => {
  it("すべての条件を URL 経由で復元する", () => {
    const filters: SetlistSearchFilters = {
      q: "日本語 & ライブ",
      year: ["2025", "2024"],
      type: ["solo", "joint"],
      song: PerformedSongs[0].slug,
      costume: AllStageCostumes[0].slug,
      isFirstPerformance: true,
      isCover: true,
    };
    const params = writeSetlistSearchParams(new URLSearchParams(), filters);
    expect(params.getAll("y")).toEqual(["2025", "2024"]);
    expect(params.getAll("t")).toEqual(["solo", "joint"]);
    expect(params.get("cover")).toBe("true");
    expect(params.get("first")).toBe("true");
    expect(params.has("isCover")).toBe(false);
    expect(params.has("isFirstPerformance")).toBe(false);
    expect(readSetlistSearchParams(new URLSearchParams(params.toString()))).toEqual(filters);
  });

  it("既定値を省略し、クリアしても無関係なパラメーターを保持する", () => {
    const original = new URLSearchParams(
      "q=test&y=2025&t=solo&s=x&costume=y&cover=true&first=true&ref=shared&ref=other",
    );
    const params = writeSetlistSearchParams(original, defaultSetlistSearchFilters());
    expect(params.toString()).toBe("ref=shared&ref=other");
    expect(original.get("q")).toBe("test");
    expect(readSetlistSearchParams(params)).toEqual(defaultSetlistSearchFilters());
  });

  it("不正な選択肢と重複を無視し、true だけを有効にする", () => {
    const params = new URLSearchParams(
      "y=2025&y=invalid&y=2025&t=solo&t=all&t=invalid&t=solo&s=missing&costume=missing&cover=1&first=false",
    );
    expect(readSetlistSearchParams(params)).toEqual({
      ...defaultSetlistSearchFilters(),
      year: ["2025"],
      type: ["solo"],
    });
  });
});
