import { オシグラフVol1 } from "~/features/publications/publications/オシグラフ.ts";
import { EventMetaDescriptor } from "../../eventMeta.ts";
import { convertPublicationToEventMeta } from "../../publicationToEventMeta.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(オシグラフVol1);

export const Content = () => {};

export default Content;
