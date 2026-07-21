import { describe, expect, it, vi } from "vitest";
import { parseTradeProductArguments, resolveTradeProductInput } from "./cli";

describe("parseTradeProductArguments", () => {
  it("parses the required image argument and supported options", () => {
    const parsed = parseTradeProductArguments([
      "--",
      "/tmp/catalog.jpg",
      "--type=photo-grid",
      "--date",
      "2026-07-20",
      "--series",
      "テスト衣装",
      "--lineup",
      "regular-27",
    ]);

    expect(parsed.ok).toBe(true);
    if (parsed.err) return;
    expect(parsed.value).toEqual({
      inputPath: "/tmp/catalog.jpg",
      type: "photo-grid",
      date: "2026-07-20",
      series: "テスト衣装",
      lineup: "regular-27",
    });
  });

  it("rejects unknown options", () => {
    const parsed = parseTradeProductArguments(["catalog.jpg", "--unknown=value"]);
    expect(parsed.err).toBe(true);
  });

  it("requires exactly one positional image path", () => {
    const missing = parseTradeProductArguments([]);
    const multiple = parseTradeProductArguments(["first.jpg", "second.jpg"]);

    expect(missing.err).toBe(true);
    expect(multiple.err).toBe(true);
  });
});

describe("resolveTradeProductInput", () => {
  it("prompts only for omitted values", async () => {
    const answers = ["mini-photo-original", "2026-07-20", "テスト", "regular-27"];
    const prompt = vi.fn(async () => answers.shift() ?? "");

    const resolved = await resolveTradeProductInput({ inputPath: "/tmp/catalog.jpg" }, prompt);

    expect(resolved.ok).toBe(true);
    if (resolved.err) return;
    expect(resolved.value).toEqual({
      inputPath: "/tmp/catalog.jpg",
      type: "mini-photo-original",
      date: "2026-07-20",
      series: "テスト",
      lineup: "regular-27",
    });
    expect(prompt).toHaveBeenCalledTimes(4);
  });

  it("keeps supplied options and prompts only for missing options", async () => {
    const answers = ["テスト", "regular-27"];
    const prompt = vi.fn(async () => answers.shift() ?? "");

    const resolved = await resolveTradeProductInput(
      {
        inputPath: "/tmp/catalog.jpg",
        type: "photo-grid",
        date: "2026-07-20",
      },
      prompt,
    );

    expect(resolved.ok).toBe(true);
    if (resolved.err) return;
    expect(resolved.value).toEqual({
      inputPath: "/tmp/catalog.jpg",
      type: "photo-grid",
      date: "2026-07-20",
      series: "テスト",
      lineup: "regular-27",
    });
    expect(prompt).toHaveBeenCalledTimes(2);
  });
});
