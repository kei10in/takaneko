import { EventMetaDescriptor } from "~/features/events/eventMeta.ts";
import { convertPublicationToEventMeta } from "~/features/events/publicationToEventMeta.ts";
import { 日経エンタテインメント_アイドル_Special_GIRL_POP_VELOCITY } from "~/features/publications/publications/日経エンタテイメント.ts";

export const meta: EventMetaDescriptor = convertPublicationToEventMeta(
  日経エンタテインメント_アイドル_Special_GIRL_POP_VELOCITY,
);

export const Content = () => {};

export default Content;
