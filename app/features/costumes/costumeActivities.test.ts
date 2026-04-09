import { Events } from "scripts/lib/events";
import { describe, expect, it } from "vitest";
import { makeLivesForCostumes } from "./costumeActivities";

const snapshotFor = (name: string) => `./__snapshots__/costumeActivities.test.ts-${name}.snap`;

describe("makeLivesForCostumes", () => {
  it("should create a list of 2022 events", async () => {
    const events = await Events.importAllEventModules();
    const events2022 = events.filter((event) => event.meta.date.startsWith("2022"));

    const result = makeLivesForCostumes(events2022).filter((x) => x.count > 0);
    await expect(result).toMatchFileSnapshot(snapshotFor("costume-activities-2022"));
  });

  it("should create a list of 2023 events", async () => {
    const events = await Events.importAllEventModules();
    const events2023 = events.filter((event) => event.meta.date.startsWith("2023"));

    const result = makeLivesForCostumes(events2023).filter((x) => x.count > 0);
    await expect(result).toMatchFileSnapshot(snapshotFor("costume-activities-2023"));
  });

  it("should create a list of 2024 events", async () => {
    const events = await Events.importAllEventModules();
    const events2024 = events.filter((event) => event.meta.date.startsWith("2024"));

    const result = makeLivesForCostumes(events2024).filter((x) => x.count > 0);
    await expect(result).toMatchFileSnapshot(snapshotFor("costume-activities-2024"));
  });

  it("should create a list of 2025 events", async () => {
    const events = await Events.importAllEventModules();
    const events2025 = events.filter((event) => event.meta.date.startsWith("2025"));

    const result = makeLivesForCostumes(events2025).filter((x) => x.count > 0);
    await expect(result).toMatchFileSnapshot(snapshotFor("costume-activities-2025"));
  });
});
