import { MDXContent } from "mdx/types";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
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

const modules = import.meta.glob("./*/*/*.{mdx,tsx}");

const importEventModule = async (im: ImportingModule): Promise<EventModule | undefined> => {
  const loaded = (await im.module()) as Record<string, unknown>;
  const meta = validateEventMeta(loaded.meta);
  if (meta == undefined) {
    return undefined;
  }

  const Content = loaded.default as MDXContent;

  return { slug: stem(im.filename), filename: im.filename, meta, Content };
};

const importEventModules = async (m: ImportingModule[]): Promise<EventModule[]> => {
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

export const importEventModulesByMonth = async (month: NaiveMonth): Promise<EventModule[]> => {
  const m = selectEventModulesByMonth(month);
  return await importEventModules(m);
};

export const selectEventModulesByMonth = (month: NaiveMonth): ImportingModule[] => {
  const result = Object.entries(modules).flatMap(([filename, module]) => {
    const y = month.year.toString().padStart(4, "0");
    const m = month.month.toString().padStart(2, "0");
    if (!filename.startsWith(`./${y}/${m}/`)) {
      return [];
    }

    return [{ filename, module }];
  });

  return result;
};

export const importEventModulesByDate = async (date: NaiveDate): Promise<EventModule[]> => {
  const m = selectEventModulesByDate(date);
  return await importEventModules(m);
};

export const selectEventModulesByDate = (date: NaiveDate): ImportingModule[] => {
  const result = Object.entries(modules).flatMap(([filename, module]) => {
    const y = date.year.toString().padStart(4, "0");
    const m = date.month.toString().padStart(2, "0");
    if (!filename.startsWith(`./${y}/${m}/${date.toString()}_`)) {
      return [];
    }

    return [{ filename, module }];
  });

  return result;
};

export const importEventModuleBySlug = async (slug: string): Promise<EventModule | undefined> => {
  const im = selectEventModuleBySlug(slug);

  if (im === undefined) {
    return undefined;
  }

  return await importEventModule(im);
};

export const selectEventModuleBySlug = (slug: string): ImportingModule | undefined => {
  const [y, m] = slug.split("_")[0].split("-");

  const key1 = `./${y}/${m}/${slug}.mdx`;
  const key2 = `./${y}/${m}/${slug}.tsx`;

  if (modules[key1]) {
    return { filename: key1, module: modules[key1] };
  } else if (modules[key2]) {
    return { filename: key2, module: modules[key2] };
  } else {
    return undefined;
  }
};
