import { EventMetaDescriptor } from "~/features/events/eventMeta";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta";
import { オシグラフVol3 } from "~/features/publications/publications/オシグラフ";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(オシグラフVol3);

export const Content = () => {};

export default Content;
