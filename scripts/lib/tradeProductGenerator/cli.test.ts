import { describe, expect, it, vi } from "vitest";
import { createTradeProductCommand, resolveTradeProductInput } from "./cli";

describe("createTradeProductCommand", () => {
  it("passes the image argument and supported options to the action", async () => {
    const action = vi.fn(async () => undefined);
    const command = createTradeProductCommand(action);

    await command.parseAsync(
      [
        "/tmp/catalog.jpg",
        "--type=photo-grid",
        "--date",
        "2026-07-20",
        "--series",
        "テスト衣装",
        "--lineup",
        "regular-27",
      ],
      { from: "user" },
    );

    expect(action).toHaveBeenCalledWith({
      inputPath: "/tmp/catalog.jpg",
      type: "photo-grid",
      date: "2026-07-20",
      series: "テスト衣装",
      lineup: "regular-27",
    });
  });

  it("rejects unknown options", async () => {
    const command = createTestCommand();

    await expect(
      command.parseAsync(["catalog.jpg", "--unknown=value"], { from: "user" }),
    ).rejects.toMatchObject({ code: "commander.unknownOption" });
  });

  it("requires exactly one positional image path", async () => {
    const missing = createTestCommand();
    const multiple = createTestCommand();

    await expect(missing.parseAsync([], { from: "user" })).rejects.toMatchObject({
      code: "commander.missingArgument",
    });
    await expect(
      multiple.parseAsync(["first.jpg", "second.jpg"], { from: "user" }),
    ).rejects.toMatchObject({ code: "commander.excessArguments" });
  });

  it("rejects unsupported option values", async () => {
    const command = createTestCommand();

    await expect(
      command.parseAsync(["catalog.jpg", "--type", "unknown"], { from: "user" }),
    ).rejects.toMatchObject({ code: "commander.invalidArgument" });
  });
});

const createTestCommand = () =>
  createTradeProductCommand(async () => undefined)
    .exitOverride()
    .configureOutput({ writeOut: () => undefined, writeErr: () => undefined });

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
