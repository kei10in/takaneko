import { Plugin } from "vite";
import { calendarBuilder } from "./calendarBuilder.ts";
import { datasetBuilder } from "./datasetBuilder.ts";
import { devThumbnail } from "./devThumbnail.ts";
import { eventIndexing } from "./eventIndexing.ts";
import { sitemapBuilder } from "./sitemapBuilder.ts";

export const takanekono = (): Plugin[] => {
  return [calendarBuilder(), sitemapBuilder(), datasetBuilder(), eventIndexing(), devThumbnail()];
};
