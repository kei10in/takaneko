import { EventMetaDescriptor } from "~/features/events/eventMeta";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta";
import { DONNA_Photobook_Momona_Matsumoto } from "~/features/publications/publications/DONNA Photobook";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(
  DONNA_Photobook_Momona_Matsumoto,
);

export const Content = () => {};

export default Content;
