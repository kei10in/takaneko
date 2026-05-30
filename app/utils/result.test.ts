import { describe, expect, it } from "vitest";
import { Err, Ok, type Result } from "~/utils/result";

describe("Result", () => {
  describe("Ok", () => {
    it("should return the correct result", () => {
      const x: Result<string, string> = Ok("success");

      expect(x.ok).toBeTruthy();
      expect(x.err).toBeFalsy();
      expect(x.value).toBe("success");
      expect(x.error).toBeUndefined();
    });
  });

  describe("Err", () => {
    it("should return the correct result", () => {
      const x: Result<string, string> = Err("error");

      expect(x.ok).toBeFalsy();
      expect(x.err).toBeTruthy();
      expect(x.value).toBeUndefined();
      expect(x.error).toBe("error");
    });
  });
});
