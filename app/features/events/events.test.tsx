import { createRoutesStub } from "react-router";
import { assert, describe, expect, it, test } from "vitest";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { allPages } from "~/utils/sitemap";
import { allAssetFiles } from "~/utils/tests/asset";
import { extractURLsFromComponent } from "~/utils/tests/react";
import { importAllEventModules, selectAllEventModules } from "./eventModule";

describe("event module", async () => {
  const AllPages = await allPages(NaiveDate.todayInJapan());
  const AllAssets = allAssetFiles();
  const AllPaths = [...AllAssets, ...AllPages.map((e) => e.path)];

  const allEvents = await importAllEventModules();

  test("all events contains all event modules", () => {
    const allModules = selectAllEventModules();

    const filenameFromEvents = new Set(allEvents.map((e) => e.filename));
    const filenameFromModules = new Set(allModules.map((m) => m.filename));

    expect(filenameFromEvents).toEqual(filenameFromModules);
  });

  describe.each(allEvents.map((e) => [e.filename, e]))("Event: %s", (filename, event) => {
    it("should have filename compliant with year, month and date", () => {
      const [year, month, slug] = filename.split("/").slice(-3);
      const idDate = NaiveDate.parseUnsafe(slug.split("_")[0]);

      expect(year).toEqual(idDate.year.toString());
      expect(month).toEqual(idDate.month.toString().padStart(2, "0"));
    });

    it("should have matching date in filename and event meta data", () => {
      const slug = filename.split("/").pop();
      assert(slug != undefined);
      const idDate = NaiveDate.parseUnsafe(slug.split("_")[0]);
      const metaDate = NaiveDate.parseUnsafe(event.meta.date);

      expect(idDate.year).toEqual(metaDate.year);
      expect(idDate.month).toEqual(metaDate.month);
      expect(idDate.day).toEqual(metaDate.day);
    });

    it("should contains valid image reference in meta", () => {
      for (const image of event.meta.images) {
        const path = image.path;
        expect(AllAssets).toContain(path);
      }
    });

    it("should contains valid image reference in content", () => {
      const Content = event.Content;
      const path = `/events/${event.slug}`;
      const Stub = createRoutesStub([{ path, Component: Content }]);

      const urls = extractURLsFromComponent(<Stub initialEntries={[path]} />)
        .filter((url) => !isAbsoluteURL(url))
        .map((url) => decodeURIComponent(url));

      urls.forEach((url) => {
        expect(AllPaths).toContain(url);
      });
    });
  });
});

const isAbsoluteURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
