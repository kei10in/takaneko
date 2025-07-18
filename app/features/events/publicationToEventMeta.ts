import { convertToGroupIfAllMembersPresent } from "~/features/profile/members";
import { Publication } from "../products/product";
import { EventMetaDescriptor } from "./eventMeta";

export const convertPublicationToEventMeta = (publication: Publication): EventMetaDescriptor => {
  return {
    summary: publication.name,
    category: "MAGAZINE",
    date: publication.date,
    region: "雑誌",
    present: convertToGroupIfAllMembersPresent(publication.featuredMembers),
    images: publication.coverImages,
    link: {
      text: "商品ページ",
      url: publication.url,
    },
    links: publication.links,
  };
};
