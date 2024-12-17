import { stem } from "~/utils/string";
import { EventModule } from "./eventModule";
import { validateEventMeta } from "./meta";

export const importEventFilesAsEventModule = (): Record<string, EventModule> => {
  return Object.fromEntries(
    Object.entries(import.meta.glob("./*/*/*.{mdx,tsx}", { eager: true })).map(
      ([filename, module]) => {
        const m = module as Record<string, unknown>;
        const meta = validateEventMeta(m.meta);
        if (meta == undefined) {
          return [];
        }

        const Content = m.default as () => JSX.Element;

        return [filename, { id: stem(filename), filename, meta, Content }];
      },
    ),
  );
};
