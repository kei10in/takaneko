import { LARME_063 } from "~/features/publications/publications/LARME";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(LARME_063);

export const Content = () => {};

export default Content;
