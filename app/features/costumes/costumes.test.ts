import { describe, expect, it } from "vitest";
import { assertValidSlug } from "~/utils/tests/slug";
import { AllCostumes } from "./costumes";

describe("costumes", () => {
  it("should have unique slugs", () => {
    const slugs = AllCostumes.map((costume) => costume.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("should have valid slugs", () => {
    AllCostumes.forEach((costume) => {
      assertValidSlug(costume.slug);
    });
  });
});
