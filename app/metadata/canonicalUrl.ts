import { DomainName } from "~/constants.ts";

export const canonicalUrl = (pathname: string): string => {
  const normalizedPathname = pathname.replace(/\/+$/u, "");

  return `https://${DomainName}${normalizedPathname}`;
};
