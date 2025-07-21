import { Plugin } from "vite";
import { calendarBuilder } from "./calendarBuilder";
import { datasetBuilder } from "./datasetBuilder";
import { sitemapBuilder } from "./sitemapBuilder";

export const takanekono = (): Plugin[] => {
  return [calendarBuilder(), sitemapBuilder(), datasetBuilder()];
};
