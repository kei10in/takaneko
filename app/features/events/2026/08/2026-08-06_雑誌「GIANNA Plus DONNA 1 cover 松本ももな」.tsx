import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { GIANNA_Plus_DONNA_1_松本ももな } from "~/features/publications/publications/GIANNA Plus DONNA.ts";

export const meta: EventMetaDescriptor =
  convertPublicationToEventMeta(GIANNA_Plus_DONNA_1_松本ももな);

export const Content = () => {};

export default Content;
