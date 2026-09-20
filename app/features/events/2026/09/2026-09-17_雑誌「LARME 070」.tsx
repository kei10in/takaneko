import { EventMetaDescriptor } from "~/features/events/eventMeta";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta";
import { LARME_070 } from "~/features/publications/publications/LARME";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(LARME_070);

export const Content = () => {};

export default Content;
