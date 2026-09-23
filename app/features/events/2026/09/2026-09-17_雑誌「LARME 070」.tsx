import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { LARME_070 } from "~/features/publications/publications/LARME.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(LARME_070);

export const Content = () => {};

export default Content;
