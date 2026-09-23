import { SiteTitle } from "~/constants.ts";

export const formatTitle = (title: string): string => {
  return `${title} | ${SiteTitle}`;
};
