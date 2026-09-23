import { IDOL_FILE_Vol35 } from "~/features/publications/publications/IDOL FILE.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(IDOL_FILE_Vol35);

export const Content = () => {};

export default Content;
