import { IDOL_FILE_Vol37 } from "~/features/products/publications/IDOL FILE";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(IDOL_FILE_Vol37);

export const Content = () => {};

export default Content;
