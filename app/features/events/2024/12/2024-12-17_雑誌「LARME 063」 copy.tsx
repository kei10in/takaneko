import { LARME_063 } from "~/features/products/publications/LARME";
import { EventMetaDescriptor } from "../../meta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(LARME_063);

export const Content = () => {};

export default Content;
