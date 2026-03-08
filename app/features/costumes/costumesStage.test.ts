import { describe, expect, it } from "vitest";
import { assertValidSlug } from "~/utils/tests/slug";
import { AllStageCostumes } from "./costumesStage";

describe("stage costumes", () => {
  it("should have unique slugs", () => {
    const slugs = AllStageCostumes.map((costume) => costume.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("should have valid slugs", () => {
    AllStageCostumes.forEach((costume) => {
      assertValidSlug(costume.slug);
    });
  });
});
