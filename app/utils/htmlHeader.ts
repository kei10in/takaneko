import { SITE_TITLE } from "~/constants";

export const formatTitle = (title: string): string => {
  return `${title} - ${SITE_TITLE}`;
};
