import { JSX } from "react";
import { stem } from "~/utils/string";
import { validateEventMeta } from "./eventMeta";
import { EventModule } from "./eventModule";

export const importEventFilesAsEventModule = (): Record<string, EventModule> => {
  return Object.fromEntries(
    Object.entries(import.meta.glob("./*/*/*.{mdx,tsx}", { eager: true })).flatMap(
      ([filename, module]): Array<[string, EventModule]> => {
        const m = module as Record<string, unknown>;
        const meta = validateEventMeta(m.meta);
        if (meta == undefined) {
          return [];
        }

        const Content = m.default as () => JSX.Element;

        return [[filename, { slug: stem(filename), filename, meta, Content }]];
      },
    ),
  );
};
