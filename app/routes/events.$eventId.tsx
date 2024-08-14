import type { MetaFunction } from "@remix-run/node";
import {
  unstable_defineClientLoader as defineClientLoader,
  Link,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import { HiArrowTopRightOnSquare, HiCalendar, HiMapPin } from "react-icons/hi2";
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
  const { meta, Content } = event;

  return (
    <div className="container mx-auto">
      <div className="space-y-2">
        {meta.image && (
          <div>
            <img src={meta.image} alt="アイキャッチ" className="w-full" />
          </div>
        )}
        <div className="mt-4 px-4 text-lg font-bold">{meta.summary}</div>
        <div className="flex items-center gap-1 px-4">
          <HiCalendar />
          <p>{meta.date}</p>
        </div>
        {meta.location && (
          <Link
            to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meta.location)}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center gap-1 px-4">
              <HiMapPin />
              <div>{meta.location}</div>
              <HiArrowTopRightOnSquare />
            </div>
          </Link>
        )}
      </div>
      <article
        className={clsx(
          "prose mt-4 px-4 py-4",
          "prose-h1:my-2 prose-h1:text-center prose-h1:text-lg",
          "prose-h2:my-2 prose-h2:text-lg",
          "prose-p:text-base",
          "prose-li:my-0 prose-li:text-base",
        )}
      >
        <Content />
      </article>
    </div>
  );
}
