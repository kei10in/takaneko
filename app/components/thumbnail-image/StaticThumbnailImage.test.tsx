import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StaticThumbnailImage } from "./StaticThumbnailImage";

afterEach(cleanup);

describe("StaticThumbnailImage", () => {
  it("元画像のパスから静的サムネイルと各倍率の候補を表示する", () => {
    const { getByRole } = render(
      <StaticThumbnailImage src="/publications/example.jpg" alt="書籍の表紙" />,
    );
    const image = getByRole("img", { name: "書籍の表紙" });

    expect(image.getAttribute("src")).toBe("/publications/thumbnails/example@1x.webp");
    expect(image.getAttribute("srcset")).toBe(
      "/publications/thumbnails/example@1x.webp 1x, /publications/thumbnails/example@2x.webp 2x, /publications/thumbnails/example@3x.webp 3x",
    );
  });

  it("日本語と空白を含むパスの srcSet をエンコードする", () => {
    const { getByRole } = render(
      <StaticThumbnailImage src="/takaneko/goods/写真 1.jpg" alt="生写真" />,
    );
    const image = getByRole("img", { name: "生写真" });

    expect(image.getAttribute("src")).toBe("/takaneko/thumbnails/goods/写真 1@1x.webp");
    expect(image.getAttribute("srcset")).toBe(
      "/takaneko/thumbnails/goods/%E5%86%99%E7%9C%9F%201@1x.webp 1x, /takaneko/thumbnails/goods/%E5%86%99%E7%9C%9F%201@2x.webp 2x, /takaneko/thumbnails/goods/%E5%86%99%E7%9C%9F%201@3x.webp 3x",
    );
  });

  it("画像の属性をそのまま渡し、ラッパーを追加しない", () => {
    const { container, getByRole } = render(
      <StaticThumbnailImage
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
