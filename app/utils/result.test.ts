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

    it("unwrap should return the value", () => {
      const x = Ok(10);

      expect(x.unwrap()).toBe(10);
    });

    it("map should transform the value", () => {
      const x = Ok(10).map((value) => value * 2);

      expect(x.ok).toBeTruthy();
      expect(x.value).toBe(20);
      expect(x.error).toBeUndefined();
    });

    it("flatMap should chain to the next Result", () => {
      const x = Ok(10).flatMap((value) => Ok(value * 3));

      expect(x.ok).toBeTruthy();
      expect(x.value).toBe(30);
      expect(x.error).toBeUndefined();
    });

    it("Rust-like methods should work with TypeScript names", () => {
      const x = Ok(10);

      expect(x.expect("should not fail")).toBe(10);
      expect(x.unwrapOr(0)).toBe(10);
      expect(x.unwrapOrElse(() => 0)).toBe(10);
      expect(x.mapErr((e) => String(e)).value).toBe(10);
      expect(x.andThen((value) => Ok(value + 1)).value).toBe(11);
      expect(x.orElse((_e) => Ok(0)).value).toBe(10);
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

    it("unwrap should throw the error", () => {
      const x = Err("error");

      expect(() => x.unwrap()).toThrow("error");
    });

    it("map should keep Err as-is", () => {
      const x = Err("error").map((value) => value * 2);

      expect(x.ok).toBeFalsy();
      expect(x.value).toBeUndefined();
      expect(x.error).toBe("error");
    });

    it("flatMap should keep Err as-is", () => {
      const x = Err("error").flatMap((value) => Ok(value * 3));

      expect(x.ok).toBeFalsy();
      expect(x.value).toBeUndefined();
      expect(x.error).toBe("error");
    });

    it("Rust-like methods should work with TypeScript names", () => {
      const x = Err("error");

      expect(() => x.expect("boom")).toThrow("boom: error");
      expect(x.unwrapOr(0)).toBe(0);
      expect(x.unwrapOrElse((e) => e.length)).toBe(5);
      expect(x.mapErr((e) => e.toUpperCase()).error).toBe("ERROR");
      expect(x.andThen((value) => Ok(value * 2)).error).toBe("error");
      expect(x.orElse((e) => Err(`wrapped:${e}`)).error).toBe("wrapped:error");
    });
  });
});
