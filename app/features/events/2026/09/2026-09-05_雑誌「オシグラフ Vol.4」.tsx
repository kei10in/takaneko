import { EventMetaDescriptor } from "~/features/events/eventMeta";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta";
import { オシグラフVol4 } from "~/features/publications/publications/オシグラフ";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(オシグラフVol4);

export const Content = () => {};

export default Content;
