import { expect } from "vitest";

/**
 * Test で slug が有効化どうかをチェックするための Vitest Matcher です。
 * 含まれてはいけない文字は以下の通りです。
 */
export const assertValidSlug = (slug: string) => {
  expect(slug, `Expected "${slug}" not to be contain "。"`).not.toContain("。");
  expect(slug, `Expected "${slug}" not to be contain "、"`).not.toContain("、");
  expect(slug, `Expected "${slug}" not to be contain "・"`).not.toContain("・");
  expect(slug, `Expected "${slug}" not to be contain "/"`).not.toContain("/");
  expect(slug, `Expected "${slug}" not to be contain "\\"`).not.toContain("\\");
  expect(slug, `Expected "${slug}" not to be contain "?"`).not.toContain("?");
  expect(slug, `Expected "${slug}" not to be contain "%"`).not.toContain("%");
  expect(slug, `Expected "${slug}" not to be contain "*"`).not.toContain("*");
  expect(slug, `Expected "${slug}" not to be contain ":"`).not.toContain(":");
  expect(slug, `Expected "${slug}" not to be contain "|"`).not.toContain("|");
  expect(slug, `Expected "${slug}" not to be contain '"'`).not.toContain('"');
  expect(slug, `Expected "${slug}" not to be contain "<"`).not.toContain("<");
  expect(slug, `Expected "${slug}" not to be contain ">"`).not.toContain(">");
};
