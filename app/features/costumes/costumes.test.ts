import { describe, expect, it } from "vitest";
import { assertValidSlug } from "~/utils/tests/slug.ts";
import { CostumeName } from "./costumeNames.ts";
import { AllCostumes } from "./costumes.ts";

describe("costumes", () => {
  it("should have registered costume names", () => {
    AllCostumes.forEach((costume) => {
      expect(CostumeName.safeParse(costume.name).success, costume.name).toBe(true);
    });
  });

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
