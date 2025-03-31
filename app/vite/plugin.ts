import { Plugin } from "vite";
import { croppingProductImages } from "./croppingProductImages";

export const takanekono = (): Plugin[] => {
  return [croppingProductImages()];
};
