import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { DONNA_Photobook_Momona_Matsumoto } from "~/features/publications/publications/DONNA Photobook.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(
  DONNA_Photobook_Momona_Matsumoto,
);

export const Content = () => {};

export default Content;
