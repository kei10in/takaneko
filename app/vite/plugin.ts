import { Plugin } from "vite";
import { calendarBuilder } from "./calendarBuilder";
import { croppingProductImages } from "./croppingProductImages";

export const takanekono = (): Plugin[] => {
  return [croppingProductImages(), calendarBuilder()];
};
