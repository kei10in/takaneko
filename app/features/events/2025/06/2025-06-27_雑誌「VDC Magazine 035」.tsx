import { VDCMagazine035 } from "~/features/products/publications/VDC Magazine";
import { EventMetaDescriptor } from "../../meta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(VDCMagazine035);

export const Content = () => {};

export default Content;
