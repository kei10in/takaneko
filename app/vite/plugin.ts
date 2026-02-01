import { Plugin } from "vite";
import { calendarBuilder } from "./calendarBuilder";
import { datasetBuilder } from "./datasetBuilder";
import { sitemapBuilder } from "./sitemapBuilder";
import { songsMetadataBuilder } from "./songsMetadataBuilder";

export const takanekono = (): Plugin[] => {
  return [calendarBuilder(), sitemapBuilder(), datasetBuilder(), songsMetadataBuilder()];
};
