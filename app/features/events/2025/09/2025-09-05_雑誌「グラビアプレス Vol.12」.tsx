import { グラビアプレスVol12 } from "~/features/products/publications/グラビアプレス";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(グラビアプレスVol12);

export const Content = () => {};

export default Content;
