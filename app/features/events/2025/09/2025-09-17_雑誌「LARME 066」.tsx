import { LARME_066 } from "~/features/publications/publications/LARME";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(LARME_066);

export const Content = () => {};

export default Content;
