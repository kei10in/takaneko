import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { dedent } from "ts-dedent";
import { unified } from "unified";
import { describe, expect, it } from "vitest";
import { gfmAlert } from "./gfmAlert";

describe("gfmAlert", () => {
  const processMarkdown = async (markdown: string) => {
    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(gfmAlert)
      .use(rehypeStringify)
      .process(markdown);
    return result.toString();
  };

  it("should transform blockquote with [!NOTE] into alert div", async () => {
    const markdown = dedent`
      > [!NOTE]
      > This is a note
    `;
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<div class="markdown-alert markdown-alert-note"><p>This is a note</p>
      </div>"
    `);
  });

  it("should transform blockquote with [!TIP] into alert div", async () => {
    const markdown = dedent`
      > [!TIP]
      > This is a tip
    `;
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<div class="markdown-alert markdown-alert-tip"><p>This is a tip</p>
      </div>"
    `);
  });

  it("should transform blockquote with [!WARNING] into alert div", async () => {
    const markdown = dedent`
      > [!WARNING]
      > This is a warning
    `;
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<div class="markdown-alert markdown-alert-warning"><p>This is a warning</p>
      </div>"
    `);
  });

  it("should transform blockquote with [!DANGER] into alert div", async () => {
    const markdown = dedent`
      > [!DANGER]
      > This is a danger
    `;
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<div class="markdown-alert markdown-alert-danger"><p>This is a danger</p>
      </div>"
    `);
  });

  it("should handle alert label with newline in same text node", async () => {
    const markdown = "> [!NOTE]\n> Content after newline";
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<div class="markdown-alert markdown-alert-note"><p>Content after newline</p>
      </div>"
    `);
  });

  it("should handle alert label only without additional content", async () => {
    const markdown = "> [!NOTE]";
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<div class="markdown-alert markdown-alert-note">
      </div>"
    `);
  });

  it("should handle case-insensitive alert labels", async () => {
    const markdown = dedent`
      > [!note]
      > Lowercase note
    `;
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<div class="markdown-alert markdown-alert-note"><p>Lowercase note</p>
      </div>"
    `);
  });

  it("should not transform regular blockquotes", async () => {
    const markdown = dedent`
      > This is a regular blockquote
      > without alert syntax
    `;
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<blockquote>
      <p>This is a regular blockquote
      without alert syntax</p>
      </blockquote>"
    `);
  });

  it("should not transform blockquotes with invalid alert labels", async () => {
    const markdown = dedent`
      > [!INVALID]
      > This should remain a blockquote
    `;
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<blockquote>
      <p>[!INVALID]
      This should remain a blockquote</p>
      </blockquote>"
    `);
  });

  it("should handle multiple paragraphs in alert", async () => {
    const markdown = dedent`
      > [!NOTE]
      > First paragraph
      >
      > Second paragraph
    `;
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<div class="markdown-alert markdown-alert-note"><p>First paragraph</p>
      <p>Second paragraph</p>
      </div>"
    `);
  });

  it("should handle list", async () => {
    const markdown = dedent`
      > [!NOTE]
      > 
      > - First item
      > - Second item
    `;
    const result = await processMarkdown(markdown);
    expect(result).toMatchInlineSnapshot(`
      "<div class="markdown-alert markdown-alert-note">
      <ul>
      <li>First item</li>
      <li>Second item</li>
      </ul>
      </div>"
    `);
  });
});
