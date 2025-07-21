import { describe, expect, it } from "vitest";
import { formatDataSize } from "./dataSize";

describe("formatDataSize", () => {
  describe("Bytes", () => {
    it("should format 0 bytes", () => {
      expect(formatDataSize(0)).toBe("0 Bytes");
    });

    it("should format 1 byte", () => {
      expect(formatDataSize(1)).toBe("1 Byte");
    });

    it("should format multiple bytes", () => {
      expect(formatDataSize(2)).toBe("2 Bytes");
      expect(formatDataSize(512)).toBe("512 Bytes");
      expect(formatDataSize(1023)).toBe("1023 Bytes");
    });
  });

  describe("KB", () => {
    it("should format exactly 1 KB", () => {
      expect(formatDataSize(1024)).toBe("1 KB");
    });

    it("should format KB values", () => {
      expect(formatDataSize(1536)).toBe("1.50 KB"); // 1024 * 1.5
      expect(formatDataSize(2048)).toBe("2 KB"); // 1024 * 2
      expect(formatDataSize(10240)).toBe("10 KB"); // 1024 * 10
      expect(formatDataSize(102400)).toBe("100 KB"); // 1024 * 100
    });

    it("should format KB with proper significant digits", () => {
      expect(formatDataSize(1024 * 1.234)).toBe("1.23 KB");
      expect(formatDataSize(1024 * 12.34)).toBe("12.3 KB");
      expect(formatDataSize(1024 * 123.4)).toBe("123 KB");
    });

    it("should format just under 1 MB", () => {
      expect(formatDataSize(1024 * 1024 - 1)).toBe("1024 KB");
    });
  });

  describe("MB", () => {
    it("should format exactly 1 MB", () => {
      expect(formatDataSize(1024 * 1024)).toBe("1 MB");
    });

    it("should format MB values", () => {
      expect(formatDataSize(1024 * 1024 * 2)).toBe("2 MB");
      expect(formatDataSize(1024 * 1024 * 10)).toBe("10 MB");
      expect(formatDataSize(1024 * 1024 * 100)).toBe("100 MB");
    });

    it("should format MB with proper significant digits", () => {
      expect(formatDataSize(1024 * 1024 * 1.234)).toBe("1.23 MB");
      expect(formatDataSize(1024 * 1024 * 12.34)).toBe("12.3 MB");
      expect(formatDataSize(1024 * 1024 * 123.4)).toBe("123 MB");
    });

    it("should format just under 1 GB", () => {
      expect(formatDataSize(1024 * 1024 * 1024 - 1)).toBe("1024 MB");
    });
  });

  describe("GB", () => {
    it("should format exactly 1 GB", () => {
      expect(formatDataSize(1024 * 1024 * 1024)).toBe("1 GB");
    });

    it("should format GB values", () => {
      expect(formatDataSize(1024 * 1024 * 1024 * 2)).toBe("2 GB");
      expect(formatDataSize(1024 * 1024 * 1024 * 10)).toBe("10 GB");
      expect(formatDataSize(1024 * 1024 * 1024 * 100)).toBe("100 GB");
    });

    it("should format GB with proper significant digits", () => {
      expect(formatDataSize(1024 * 1024 * 1024 * 1.234)).toBe("1.23 GB");
      expect(formatDataSize(1024 * 1024 * 1024 * 12.34)).toBe("12.3 GB");
      expect(formatDataSize(1024 * 1024 * 1024 * 123.4)).toBe("123 GB");
    });

    it("should format very large GB values", () => {
      expect(formatDataSize(1024 * 1024 * 1024 * 1000)).toBe("1000 GB");
    });
  });
});
