import { IDOL_FILE_Vol35 } from "~/features/products/publications/IDOL FILE";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(IDOL_FILE_Vol35);

export const Content = () => {};

export default Content;
