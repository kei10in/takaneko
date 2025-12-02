import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { NaiveMonth } from "~/utils/datetime/NaiveMonth";
import { EventModule, importEventModule, importEventModules, ImportingModule } from "./eventModule";

export class EventRepository {
  private readonly modules: Record<string, () => Promise<unknown>>;

  constructor(modules: Record<string, () => Promise<unknown>>) {
    this.modules = modules;
  }

  importAllEventModules = async (): Promise<EventModule[]> => {
    const m = this.selectAllEventModules();
    return await importEventModules(m);
  };

  selectAllEventModules = (): ImportingModule[] => {
    const result = Object.entries(this.modules).map(([filename, module]) => ({ filename, module }));
    return result;
  };

  importEventModulesByMonth = async (month: NaiveMonth): Promise<EventModule[]> => {
    const m = this.selectEventModulesByMonth(month);
    return await importEventModules(m);
  };

  selectEventModulesByMonth = (month: NaiveMonth): ImportingModule[] => {
    const result = Object.entries(this.modules).flatMap(([filename, module]) => {
      const y = month.year.toString().padStart(4, "0");
      const m = month.month.toString().padStart(2, "0");
      if (!filename.startsWith(`./${y}/${m}/`)) {
        return [];
      }

      return [{ filename, module }];
    });

    return result;
  };

  importEventModulesByDate = async (date: NaiveDate): Promise<EventModule[]> => {
    const m = this.selectEventModulesByDate(date);
    return await importEventModules(m);
  };

  selectEventModulesByDate = (date: NaiveDate): ImportingModule[] => {
    const result = Object.entries(this.modules).flatMap(([filename, module]) => {
      const y = date.year.toString().padStart(4, "0");
      const m = date.month.toString().padStart(2, "0");
      if (!filename.startsWith(`./${y}/${m}/${date.toString()}_`)) {
        return [];
      }

      return [{ filename, module }];
    });

    return result;
  };

  importEventModuleBySlug = async (slug: string): Promise<EventModule | undefined> => {
    const im = this.selectEventModuleBySlug(slug);

    if (im === undefined) {
      return undefined;
    }

    return await importEventModule(im);
  };

  selectEventModuleBySlug = (slug: string): ImportingModule | undefined => {
    // Validate slug format: YYYY-MM-DD_title
    const match = /^(\d{4})-(\d{2})-\d{2}_.+/.exec(slug);
    if (!match) {
      return undefined;
    }
    const y = match[1];
    const m = match[2];

    const key1 = `./${y}/${m}/${slug}.mdx`;
    const key2 = `./${y}/${m}/${slug}.tsx`;

    if (this.modules[key1]) {
      return { filename: key1, module: this.modules[key1] };
    } else if (this.modules[key2]) {
      return { filename: key2, module: this.modules[key2] };
    } else {
      return undefined;
    }
  };
}
