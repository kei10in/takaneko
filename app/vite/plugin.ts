import { Plugin } from "vite";
import { calendarBuilder } from "./calendarBuilder";
import { datasetBuilder } from "./datasetBuilder";
import { devThumbnail } from "./devThumbnail";
import { eventIndexing } from "./eventIndexing";
import { sitemapBuilder } from "./sitemapBuilder";

export const takanekono = (): Plugin[] => {
  return [calendarBuilder(), sitemapBuilder(), datasetBuilder(), eventIndexing(), devThumbnail()];
};
