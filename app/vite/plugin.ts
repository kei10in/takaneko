import { Plugin } from "vite";
import { calendarBuilder } from "./calendarBuilder";
import { sitemapBuilder } from "./sitemapBuilder";

export const takanekono = (): Plugin[] => {
  return [calendarBuilder(), sitemapBuilder()];
};
