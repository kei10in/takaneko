import { DomainName } from "~/constants";

export const canonicalUrl = (pathname: string): string => {
  const normalizedPathname = pathname.replace(/\/+$/, "");

  return `https://${DomainName}${normalizedPathname}`;
};
