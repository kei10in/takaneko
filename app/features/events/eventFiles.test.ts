import { glob } from "glob";
import * as path from "node:path";
import { assert, describe, expect, it } from "vitest";
import { isObject } from "~/utils/types/object";
import { importEventFilesAsEventModule } from "./eventFiles";

describe("event files", () => {
  const dirname = import.meta.dirname.replace(/\\/g, "/");

  describe("importEventFiles", () => {
    it("should import all event files", async () => {
      const importedEvents = Object.keys(importEventFilesAsEventModule())
        .map((filename) => filename.split("/").pop() as string)
        .toSorted();
      const eventFiles = (await glob(`${dirname}/*/*/*.{mdx,tsx}`))
        .map((s) => s.split(path.sep).pop() as string)
        .toSorted();

      expect(importedEvents).toEqual(eventFiles);
    });
  });

  describe("imported events", () => {
    const importedEvents = Object.values(importEventFilesAsEventModule());

    describe.each(importedEvents)("module $filename", (module) => {
      it("should export meta as EventMeta", () => {
        assert(isObject(module));
        expect(module.meta).not.toBeUndefined();
      });
    });
  });
});
