import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { OrganizedTradeImages } from "./OrganizedTradeImages.tsx";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("同じまとめ画像を再表示する場合は新しい画像 URL を使う", () => {
  const createObjectURL = vi
    .spyOn(URL, "createObjectURL")
    .mockReturnValueOnce("blob:first")
    .mockReturnValueOnce("blob:second");
  const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL");
  const blob = new Blob(["test"], { type: "image/webp" });

  const first = render(<OrganizedTradeImages title="生写真セットのまとめ" images={[blob]} />);
  expect(screen.getByRole("img", { name: "まとめ画像 0" }).getAttribute("src")).toBe("blob:first");

  first.unmount();
  expect(revokeObjectURL).toHaveBeenCalledWith("blob:first");

  render(<OrganizedTradeImages title="生写真セットのまとめ" images={[blob]} />);
  expect(screen.getByRole("img", { name: "まとめ画像 0" }).getAttribute("src")).toBe("blob:second");
  expect(createObjectURL).toHaveBeenNthCalledWith(2, blob);
});
