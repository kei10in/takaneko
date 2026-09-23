import { Publication } from "../publications/types.ts";
import { EventMetaDescriptor } from "./eventMeta.ts";
import { EventType } from "./EventType.ts";

export const convertPublicationToEventMeta = (
  publication: Publication | undefined = undefined,
): EventMetaDescriptor => {
  if (publication == undefined) {
    throw new Error("Publication data is required to convert to EventMetaDescriptor");
  }

  return {
    summary: publication.name,
    category: publication.kind == "books" ? EventType.BOOK : EventType.MAGAZINE,
    date: publication.date,
    region: publication.kind == "books" ? "書籍" : "雑誌",
    present: publication.featuredMembers,
    absent: publication.absent,
    images: publication.coverImages,
    link: {
      text: "商品ページ",
      url: publication.url,
    },
    links: publication.links,
  };
};
