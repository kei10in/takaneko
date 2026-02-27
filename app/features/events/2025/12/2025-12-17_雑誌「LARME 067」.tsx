import { LARME_067 } from "~/features/publications/publications/LARME";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(LARME_067);

export const Content = () => {};

export default Content;
