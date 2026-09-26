import { describe, expect, it, vi } from "vitest";
import { loadImage } from "./loadImage.ts";

describe("loadImage", () => {
  it("resolves with the image after it loads", async () => {
    const image = new Image();
    const loaded = loadImage(image, "/example.png");

    expect(image.getAttribute("src")).toBe("/example.png");
    image.dispatchEvent(new Event("load"));

    await expect(loaded).resolves.toBe(image);
  });

  it("preserves an existing load handler", async () => {
    const image = new Image();
    const onLoad = vi.fn();
    // 既存の onload プロパティが上書きされないことを確認します。
    // oxlint-disable-next-line unicorn/prefer-add-event-listener
    image.onload = onLoad;
    const loaded = loadImage(image, "/example.png");

    image.dispatchEvent(new Event("load"));

    await expect(loaded).resolves.toBe(image);
    expect(onLoad).toHaveBeenCalledOnce();
  });
});
