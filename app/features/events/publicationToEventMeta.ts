import { Publication } from "../products/product";
import { EventMetaDescriptor } from "./eventMeta";
import { EventType } from "./EventType";

export const convertPublicationToEventMeta = (publication: Publication): EventMetaDescriptor => {
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
