import { VDCMagazine035 } from "~/features/publications/publications/VDC Magazine.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(VDCMagazine035);

export const Content = () => {};

export default Content;
