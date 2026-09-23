import { LARME_065 } from "~/features/publications/publications/LARME.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(LARME_065);

export const Content = () => {};

export default Content;
