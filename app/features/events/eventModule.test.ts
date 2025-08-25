import fs from "node:fs";
import { assert, describe, expect, it } from "vitest";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { isObject } from "~/utils/types/object";
import {
  importAllEventModules,
  selectEventModuleBySlug,
  selectEventModulesByDate,
  selectEventModulesByMonth,
} from "./eventModule";

describe("eventModule", () => {
  describe("imported events", async () => {
    const importedEvents = await importAllEventModules();

    describe.each(importedEvents)("module $filename", (module) => {
      it("should export meta as EventMeta", () => {
        assert(isObject(module));
        expect(module.meta).not.toBeUndefined();
      });
    });
  });

  describe("selectEventModuleByMonth", () => {
    it("should return modules for the specified month", () => {
      const month = new NaiveMonth(2025, 7);
      const result = selectEventModulesByMonth(month);

      const files = fs.readdirSync(`${import.meta.dirname}/2025/07`);

      expect(result.length).toBe(files.length);
    });
  });

  describe("selectEventModuleByDate", () => {
    it("should return modules for the specified date", () => {
      const date = new NaiveDate(2025, 8, 7);
      const result = selectEventModulesByDate(date);

      expect(result).toEqual([
        expect.objectContaining({
          filename: "./2025/08/2025-08-07_3rd ファンミーティング 〜私たちの宣言式〜.mdx",
        }),
      ]);
    });

    it("should return modules for the specified date", () => {
      const date = new NaiveDate(2025, 8, 5);
      const result = selectEventModulesByDate(date);

      expect(result).toEqual([]);
    });
  });

  describe("selectEventModuleBySlug", () => {
    it("should return module for mdx file by slug", () => {
      const slug = "2025-08-13_NEO KASSEN 2025";
      const result = selectEventModuleBySlug(slug);

      expect(result).toMatchObject({ filename: "./2025/08/2025-08-13_NEO KASSEN 2025.mdx" });
    });

    it("should return undefined for invalid slug format 1", () => {
      const slug = "invalid slug format";
      const result = selectEventModuleBySlug(slug);

      expect(result).toBeUndefined();
    });

    it("should return undefined for invalid slug format 2", () => {
      const slug = "prefix_invalid slug format";
      const result = selectEventModuleBySlug(slug);

      expect(result).toBeUndefined();
    });
  });
});
