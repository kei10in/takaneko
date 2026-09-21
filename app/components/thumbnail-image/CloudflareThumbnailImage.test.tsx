import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CloudflareThumbnailImage } from "./CloudflareThumbnailImage";

afterEach(cleanup);

describe("CloudflareThumbnailImage", () => {
  it("元画像のパスからCloudflare の変換画像と各倍率の候補を表示する", () => {
    const { getByRole } = render(
      <CloudflareThumbnailImage src="/publications/example.jpg" alt="書籍の表紙" />,
    );
    const image = getByRole("img", { name: "書籍の表紙" });

    expect(image.getAttribute("src")).toBe(
      "/cdn-cgi/image/width=240,height=240,fit=contain,format=webp,quality=80/publications/example.jpg",
    );
    expect(image.getAttribute("srcset")).toBe(
      "/cdn-cgi/image/width=240,height=240,fit=contain,format=webp,quality=80/publications/example.jpg 1x, /cdn-cgi/image/width=480,height=480,fit=contain,format=webp,quality=80/publications/example.jpg 2x, /cdn-cgi/image/width=720,height=720,fit=contain,format=webp,quality=80/publications/example.jpg 3x",
    );
  });

  it("日本語と空白を含むパスの srcSet をエンコードする", () => {
    const { getByRole } = render(
      <CloudflareThumbnailImage src="/takaneko/goods/写真 1.jpg" alt="生写真" />,
    );
    const image = getByRole("img", { name: "生写真" });

    expect(image.getAttribute("src")).toBe(
      "/cdn-cgi/image/width=240,height=240,fit=contain,format=webp,quality=80/takaneko/goods/%E5%86%99%E7%9C%9F%201.jpg",
    );
    expect(image.getAttribute("srcset")).toBe(
      "/cdn-cgi/image/width=240,height=240,fit=contain,format=webp,quality=80/takaneko/goods/%E5%86%99%E7%9C%9F%201.jpg 1x, /cdn-cgi/image/width=480,height=480,fit=contain,format=webp,quality=80/takaneko/goods/%E5%86%99%E7%9C%9F%201.jpg 2x, /cdn-cgi/image/width=720,height=720,fit=contain,format=webp,quality=80/takaneko/goods/%E5%86%99%E7%9C%9F%201.jpg 3x",
    );
  });

  it("画像の属性をそのまま渡し、ラッパーを追加しない", () => {
    const { container, getByRole } = render(
      <CloudflareThumbnailImage
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
