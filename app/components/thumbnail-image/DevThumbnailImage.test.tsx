import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DevThumbnailImage } from "./DevThumbnailImage";

afterEach(cleanup);

describe("DevThumbnailImage", () => {
  it("開発サーバーの画像変換 URL を各倍率の候補にする", () => {
    const { getByRole } = render(
      <DevThumbnailImage src="/publications/example.jpg" alt="書籍の表紙" />,
    );
    const image = getByRole("img");
    expect(image.getAttribute("src")).toBe(
      "/__thumbnail?src=%2Fpublications%2Fexample.jpg&size=240",
    );
    expect(image.getAttribute("srcset")).toBe(
      "/__thumbnail?src=%2Fpublications%2Fexample.jpg&size=240 1x, /__thumbnail?src=%2Fpublications%2Fexample.jpg&size=480 2x, /__thumbnail?src=%2Fpublications%2Fexample.jpg&size=720 3x",
    );
  });

  it("日本語・空白・クエリの区切り文字を含む元画像パスを保持する", () => {
    const src = "/takaneko/goods/写真 1&2#3+.jpg";
    const { getByRole } = render(<DevThumbnailImage src={src} alt="生写真" />);
    const candidates = getByRole("img").getAttribute("srcset")?.split(", ") ?? [];
    expect(candidates).toHaveLength(3);
    candidates.forEach((candidate) => {
      const url = new URL(candidate.split(" ")[0], "http://localhost");
      expect(url.searchParams.get("src")).toBe(src);
    });
  });

  it("画像属性を引き継ぎ、ラッパーを追加しない", () => {
    const { container, getByRole } = render(
      <DevThumbnailImage
        src="/publications/example.jpg"
        alt="書籍の表紙"
        className="object-contain"
        loading="lazy"
        width={240}
        height={180}
      />,
    );
    const image = getByRole("img", { name: "書籍の表紙" });
    expect(image.getAttribute("class")).toBe("object-contain");
    expect(image.getAttribute("loading")).toBe("lazy");
    expect(image.getAttribute("width")).toBe("240");
    expect(image.getAttribute("height")).toBe("180");
    expect(container.firstElementChild).toBe(image);
  });
});
