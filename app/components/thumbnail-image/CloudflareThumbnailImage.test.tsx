import { cleanup, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { CloudflareThumbnailImage } from "./CloudflareThumbnailImage.tsx";

afterEach(cleanup);

const renderImage = (
  element: React.ReactNode,
  url = "https://preview.example.com/events?year=2026",
) => {
  const router = createMemoryRouter([{ id: "root", path: "/", element }], {
    hydrationData: { loaderData: { root: { url } } },
  });
  return render(<RouterProvider router={router} />);
};

describe("CloudflareThumbnailImage", () => {
  it("固定ドメインの画像変換 URL にリクエスト元の画像 URL を含める", () => {
    const { getByRole } = renderImage(
      <CloudflareThumbnailImage src="/publications/example.jpg" alt="書籍の表紙" />,
    );
    const image = getByRole("img", { name: "書籍の表紙" });

    expect(image.getAttribute("src")).toBe(
      "https://takanekofan.app/cdn-cgi/image/width=240,height=240,fit=contain,format=webp,quality=80/https://preview.example.com/publications/example.jpg",
    );
    expect(image.getAttribute("srcset")).toBe(
      "https://takanekofan.app/cdn-cgi/image/width=240,height=240,fit=contain,format=webp,quality=80/https://preview.example.com/publications/example.jpg 1x, https://takanekofan.app/cdn-cgi/image/width=480,height=480,fit=contain,format=webp,quality=80/https://preview.example.com/publications/example.jpg 2x, https://takanekofan.app/cdn-cgi/image/width=720,height=720,fit=contain,format=webp,quality=80/https://preview.example.com/publications/example.jpg 3x",
    );
  });

  it("変換元画像の URL にリクエストのプロトコルとポートを保持する", () => {
    const { getByRole } = renderImage(
      <CloudflareThumbnailImage src="/publications/example.jpg" alt="書籍の表紙" />,
      "http://localhost:5173/publications/example?preview=true",
    );
    expect(getByRole("img").getAttribute("src")).toBe(
      "https://takanekofan.app/cdn-cgi/image/width=240,height=240,fit=contain,format=webp,quality=80/http://localhost:5173/publications/example.jpg",
    );
  });

  it("日本語と空白を含むパスの srcSet をエンコードする", () => {
    const { getByRole } = renderImage(
      <CloudflareThumbnailImage src="/takaneko/goods/写真 1.jpg" alt="生写真" />,
    );
    const image = getByRole("img", { name: "生写真" });

    expect(image.getAttribute("src")).toBe(
      "https://takanekofan.app/cdn-cgi/image/width=240,height=240,fit=contain,format=webp,quality=80/https://preview.example.com/takaneko/goods/%E5%86%99%E7%9C%9F%201.jpg",
    );
    expect(image.getAttribute("srcset")).toBe(
      "https://takanekofan.app/cdn-cgi/image/width=240,height=240,fit=contain,format=webp,quality=80/https://preview.example.com/takaneko/goods/%E5%86%99%E7%9C%9F%201.jpg 1x, https://takanekofan.app/cdn-cgi/image/width=480,height=480,fit=contain,format=webp,quality=80/https://preview.example.com/takaneko/goods/%E5%86%99%E7%9C%9F%201.jpg 2x, https://takanekofan.app/cdn-cgi/image/width=720,height=720,fit=contain,format=webp,quality=80/https://preview.example.com/takaneko/goods/%E5%86%99%E7%9C%9F%201.jpg 3x",
    );
  });

  it("画像の属性をそのまま渡し、ラッパーを追加しない", () => {
    const { container, getByRole } = renderImage(
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
