import type { BreadcrumbList } from "schema-dts";
import { DomainName, SiteName } from "~/constants";

export type LdJsonBreadcrumbList = BreadcrumbList & {
  "@id": string;
  "@type": "BreadcrumbList";
  itemListElement: LdJsonBreadcrumbListItem[];
};

type LdJsonBreadcrumbListItem = {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
};

export interface LdJsonEventBreadcrumbListArgs {
  id: string;
  eventName: string;
  eventUrl: string;
}

export const eventBreadcrumbListDocument = ({
  id,
  eventName,
  eventUrl,
}: LdJsonEventBreadcrumbListArgs): LdJsonBreadcrumbList => {
  const itemListElement: LdJsonBreadcrumbListItem[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: SiteName,
      item: `https://${DomainName}`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "スケジュール",
      item: `https://${DomainName}/calendar`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: eventName,
      item: eventUrl,
    },
  ];

  // schema-dts does not model the URL-string form of ListItem.item used by Google examples.
  return {
    "@id": id,
    "@type": "BreadcrumbList",
    itemListElement,
  } as LdJsonBreadcrumbList;
};
