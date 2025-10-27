import { createRoutesStub } from "react-router";
import { assert, describe, expect, it } from "vitest";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { allAssetFiles } from "~/utils/tests/asset";
import { extractURLsFromComponent } from "~/utils/tests/react";
import { importAllEventModules } from "./eventModule";

describe("event module", async () => {
  const AllAssets = allAssetFiles();

  const allEvents = await importAllEventModules();

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
      const metaDate = event.meta.naiveDate;

      expect(idDate.year).toEqual(metaDate.year);
      expect(idDate.month).toEqual(metaDate.month);
      expect(idDate.day).toEqual(metaDate.day);
    });

    it("should contains valid image reference in meta", () => {
      const path = event.meta.image?.path;
      if (path == undefined || path == "") {
        return;
      }
      expect(AllAssets).toContain(path);
    });

    it("should contains valid image reference in content", () => {
      const Content = event.Content;
      const path = `/events/${event.slug}`;
      const Stub = createRoutesStub([{ path, Component: Content }]);

      const urls = extractURLsFromComponent(<Stub initialEntries={[path]} />)
        .filter((url) => !isAbsoluteURL(url))
        .map((url) => decodeURIComponent(url));

      urls.forEach((url) => {
        expect(AllAssets).toContain(url);
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
