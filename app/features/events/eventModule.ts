import { MDXContent } from "mdx/types";
import { dedent } from "ts-dedent";
import { makeMarkdownComponent } from "~/components/markdownComponentBuilder";
import { stem } from "~/utils/string";
import { EventMeta, validateEventMeta } from "./eventMeta";

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
  const loaded = (await im.module()) as Record<string, unknown>;
  const meta = validateEventMeta(loaded.meta);
  if (meta == undefined) {
    return undefined;
  }

  // Event Module を .ts や .tsx でかく場合は、`default export` 意外も受け入れる。
  const content = loaded.content ?? loaded.default;

  const Content =
    typeof content === "string" ? makeMarkdownComponent(dedent(content)) : (content as MDXContent);

  return { slug: stem(im.filename), filename: im.filename, meta, Content };
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
