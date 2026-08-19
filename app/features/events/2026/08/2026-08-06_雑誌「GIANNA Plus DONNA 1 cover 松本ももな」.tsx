import { EventMetaDescriptor } from "~/features/events/eventMeta";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta";
import { GIANNA_Plus_DONNA_1_松本ももな } from "~/features/publications/publications/GIANNA Plus DONNA";

export const meta: EventMetaDescriptor =
  convertPublicationToEventMeta(GIANNA_Plus_DONNA_1_松本ももな);

export const Content = () => {};

export default Content;
