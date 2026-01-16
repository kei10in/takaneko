import { オシグラフVol2 } from "~/features/products/publications/オシグラフ";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(オシグラフVol2);

export const Content = () => {};

export default Content;
