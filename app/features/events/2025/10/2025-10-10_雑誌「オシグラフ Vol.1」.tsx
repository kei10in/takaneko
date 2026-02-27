import { オシグラフVol1 } from "~/features/publications/publications/オシグラフ";
import { EventMetaDescriptor } from "../../eventMeta";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(オシグラフVol1);

export const Content = () => {};

export default Content;
