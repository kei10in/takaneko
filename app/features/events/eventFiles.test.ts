import { glob } from "glob";
import * as path from "node:path";
import { assert, describe, expect, it } from "vitest";
import { isObject } from "~/utils/types/object";
import { importEventFiles } from "./eventFiles";
import { validateEventMeta } from "./meta";

describe("event files", () => {
  describe("importEventFiles", () => {
    it("should import all event files", async () => {
      const importedEvents = importEventFiles()
        .map((e) => e.filename.split("/").pop() as string)
        .toSorted();
      const eventFiles = (await glob(`${__dirname}/*/*/*.mdx`))
        .map((s) => s.split(path.sep).pop() as string)
        .toSorted();

      expect(importedEvents).toEqual(eventFiles);
    });
  });

  describe("imported events", () => {
    const importedEvents = importEventFiles();

    describe.each(importedEvents)("module $filename", ({ module }) => {
      it("should export meta as EventMeta", () => {
        assert(isObject(module));
        expect(module.meta).not.toBeUndefined();
        const meta = validateEventMeta(module.meta);
        expect(meta).not.toBeUndefined();
      });
    });
  });
});
