import { MDXContent } from "mdx/types";
import { dedent } from "ts-dedent";
import { makeMarkdownComponent } from "~/components/markdownComponentBuilder.tsx";
import { stem } from "~/utils/string.ts";
import { isObject } from "~/utils/types/object.ts";
import { EventMeta, validateEventMeta } from "./eventMeta.ts";

export interface EventModule {
  slug: string;
  filename: string;
  meta: EventMeta;
  Content: MDXContent;
}

export interface ImportingModule {
  filename: string;
  module: () => Promise<unknown>;
}

export const importEventModule = async (im: ImportingModule): Promise<EventModule | undefined> => {
  const loaded = await im.module();
  if (!isObject(loaded)) {
    return undefined;
  }

  const meta = validateEventMeta(loaded.meta);
  if (meta == undefined) {
    return undefined;
  }

  // Event Module を .ts や .tsx でかく場合は、`default export` 意外も受け入れる。
  const content = loaded.content ?? loaded.default;
  if (content == undefined) {
    return undefined;
  }

  if (typeof content === "string") {
    const Content = makeMarkdownComponent(dedent(content));
    return { slug: stem(im.filename), filename: im.filename, meta, Content };
  }

  if (typeof content === "function") {
    // 関数であることまでは検証済み。引数と戻り値の契約は MDX コンパイラと
    // リポジトリ内のイベント実装を信頼するため、この境界に限って型を指定します。
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const Content = content as MDXContent;
    return { slug: stem(im.filename), filename: im.filename, meta, Content };
  }

  return undefined;
};

export const importEventModules = async (m: ImportingModule[]): Promise<EventModule[]> => {
  const promises = m.map(async (im): Promise<EventModule[]> => {
    const eventModule = await importEventModule(im);
    if (eventModule == undefined) {
      return [];
    }
    return [eventModule];
  });

  const result = (await Promise.all(promises)).flatMap((x) => x);

  return result;
};
