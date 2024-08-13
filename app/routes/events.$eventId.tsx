import type { MetaFunction } from "@remix-run/node";
import { unstable_defineClientLoader as defineClientLoader, useLoaderData } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { EventContent, loadEventContent } from "~/features/events/events";

export const meta: MetaFunction = () => {
  return [
    { title: `トレード画像つくるやつ。- ${SITE_TITLE}` },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export const clientLoader = defineClientLoader(async ({ params }): Promise<EventContent> => {
  const { eventId } = params;

  if (eventId == undefined) {
    throw new Response("", { status: 404 });
  }

  const event = await loadEventContent(eventId);
  if (event == undefined) {
    throw new Response("", { status: 404 });
  }

  return event;
});

export default function EventPage() {
  const event = useLoaderData<typeof clientLoader>();
  const { Content } = event;

  return (
    <div className="container prose mx-auto">
      <Content />
    </div>
  );
}
