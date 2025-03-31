import { Plugin } from "vite";
import { calendarBuilder } from "./calendarBuilder";
import { croppingProductImages } from "./croppingProductImages";
import { sitemapBuilder } from "./sitemapBuilder";

export const takanekono = (): Plugin[] => {
  return [croppingProductImages(), calendarBuilder(), sitemapBuilder()];
};
