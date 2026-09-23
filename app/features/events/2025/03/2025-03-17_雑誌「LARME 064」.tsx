import { LARME_064 } from "~/features/publications/publications/LARME.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(LARME_064);

export const Content = () => {};

export default Content;
