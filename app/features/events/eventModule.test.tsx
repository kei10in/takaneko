import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { importEventModule } from "./eventModule.ts";

const meta = { summary: "テストイベント", category: "LIVE", date: "2026-09-27" };
const Content = () => <p>MDX の本文</p>;
const filename = "2026-09-27_テストイベント.mdx";

describe("importEventModule", () => {
  it.each([undefined, null, true, 42, "module", [], () => undefined])(
    "オブジェクトではない値や空の配列を読み込まない: %s",
    async (value) => {
      const event = await importEventModule({ filename, module: async () => value });
      expect(event).toBeUndefined();
    },
  );

  it.each([undefined, null, {}, { ...meta, category: "INVALID" }])(
    "メタデータが不正なモジュールを読み込まない: %s",
    async (value) => {
      const event = await importEventModule({
        filename,
        module: async () => ({ meta: value, default: Content }),
      });
      expect(event).toBeUndefined();
    },
  );

  it.each([true, 42, {}, []])("不正な content を読み込まない: %s", async (content) => {
    const event = await importEventModule({
      filename,
      module: async () => ({ meta, content, default: Content }),
    });
    expect(event).toBeUndefined();
  });

  it.each([true, 42, {}, []])("不正な default export を読み込まない: %s", async (value) => {
    const event = await importEventModule({
      filename,
      module: async () => ({ meta, default: value }),
    });
    expect(event).toBeUndefined();
  });

  it("本文がないモジュールは読み込まない", async () => {
    const event = await importEventModule({ filename, module: async () => ({ meta }) });
    expect(event).toBeUndefined();
  });

  it("MDX の default export を本文として読み込む", async () => {
    const event = await importEventModule({
      filename,
      module: async () => ({ meta, default: Content }),
    });
    expect(event?.Content).toBe(Content);
  });

  it("関数の content を本文として読み込む", async () => {
    const event = await importEventModule({
      filename,
      module: async () => ({ meta, content: Content }),
    });
    expect(event?.Content).toBe(Content);
  });

  it("content が null なら default export を本文として読み込む", async () => {
    const event = await importEventModule({
      filename,
      module: async () => ({ meta, content: null, default: Content }),
    });
    expect(event?.Content).toBe(Content);
  });

  it("文字列の content を default export より優先して Markdown として読み込む", async () => {
    const event = await importEventModule({
      filename,
      module: async () => ({ meta, content: "**本文**", default: () => <p>別の本文</p> }),
    });
    expect(event).toBeDefined();
    if (event == undefined) {
      return;
    }
    expect(renderToStaticMarkup(<event.Content />)).toMatch(/<strong[^>]*>本文<\/strong>/u);
  });
});
