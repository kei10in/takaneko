import { render } from "@testing-library/react";
import React from "react";

/**
 * React コンポーネントから URL の参照を抽出します。
 */
export const extractURLsFromComponent = (component: React.ReactElement): string[] => {
  // @testing-library/react を使用してコンポーネントをレンダリング
  const { container } = render(component);

  // DOM にアクセスして URL を抽出
  const urls: string[] = [];

  // <a> タグの href 属性を収集
  container.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (href) {
      urls.push(href);
    }
  });

  // <img> タグの src 属性を収集
  container.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src");
    if (src) {
      urls.push(src);
    }
  });

  // その他のタグの参照を収集する場合は、必要に応じて追加

  return urls;
};
