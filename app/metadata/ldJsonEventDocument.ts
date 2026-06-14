import { Graph } from "schema-dts";
import type { EventMeta } from "~/features/events/eventMeta";
import { eventBreadcrumbListDocument, LdJsonBreadcrumbList } from "./ldJsonBreadcrumbList";
import { LdJsonIds } from "./ldJsonIds";
import { LdJsonMusicEvent, musicEventDocument } from "./ldJsonMusicEvent";
import { LdJsonWebPage, webPageDocument } from "./ldJsonWebPage";

export type LdJsonEventDocument =
  | (Graph & {
      "@graph": [LdJsonWebPage, LdJsonBreadcrumbList, LdJsonMusicEvent];
    })
  | (Graph & { "@graph": [LdJsonWebPage, LdJsonBreadcrumbList] });

export interface LdJsonEventDocumentArgs {
  event: EventMeta;
  canonicalUrl: string;
  name: string;
  description: string;
}

export const ldJsonEventDocument = ({
  event,
  canonicalUrl,
  name,
  description,
}: LdJsonEventDocumentArgs): LdJsonEventDocument => {
  const webPageId = LdJsonIds.webPage(canonicalUrl);
  const breadcrumbListId = LdJsonIds.breadcrumbList(canonicalUrl);

  const webPage = webPageDocument({
    id: webPageId,
    url: canonicalUrl,
    name,
    description,
    breadcrumbId: breadcrumbListId,
  });
  const breadcrumbList = eventBreadcrumbListDocument({
    id: breadcrumbListId,
    eventName: event.summary,
    eventUrl: canonicalUrl,
  });

  const musicEventId = LdJsonIds.musicEvent(canonicalUrl);
  const musicEvent = musicEventDocument(event, musicEventId);

  if (musicEvent != undefined) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          ...webPage,
          mainEntity: { "@id": musicEvent["@id"] },
        },
        breadcrumbList,
        {
          ...musicEvent,
          mainEntityOfPage: { "@id": webPage["@id"] },
        },
      ],
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [webPage, breadcrumbList],
  };
};
