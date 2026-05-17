import { SiteTitle } from "~/constants";

export const formatTitle = (title: string): string => {
  return `${title} | ${SiteTitle}`;
};
