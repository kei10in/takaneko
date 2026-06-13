import type { Location } from "react-router";
import { DomainName } from "~/constants";

export const canonicalUrl = (location: Location): string => {
  const pathname = location.pathname.replace(/\/+$/, "");

  return `https://${DomainName}${pathname}`;
};
