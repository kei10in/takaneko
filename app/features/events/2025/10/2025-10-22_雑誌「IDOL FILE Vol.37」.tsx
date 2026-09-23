import { IDOL_FILE_Vol37 } from "~/features/publications/publications/IDOL FILE.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(IDOL_FILE_Vol37);

export const Content = () => {};

export default Content;
