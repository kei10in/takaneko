import type { MetaFunction } from "@remix-run/node";
import { unstable_defineClientLoader as defineClientLoader, useLoaderData } from "@remix-run/react";
import { Calendar } from "~/components/calendar/Calendar";
import { EventType } from "~/components/calendar/event";
import { SITE_TITLE } from "~/constants";
import { EventModule, loadEvents } from "~/features/events/events";

export const meta: MetaFunction = () => {
  return [
    { title: `トレード画像つくるやつ。- ${SITE_TITLE}` },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export const clientLoader = defineClientLoader(async (): Promise<EventModule[]> => {
  const events = await loadEvents({ year: 2024, month: 8 });
  return events;
});

export default function Index() {
  const events = useLoaderData<EventModule[]>();
  const calendarEvents = events.map((event) => ({
    id: event.id,
    category: EventType.LIVE,
    summary: event.meta.summary,
    date: Date.parse(event.meta.date),
    region: event.meta.region,
  }));

  return (
    <div className="container mx-auto mt-4">
      <Calendar events={calendarEvents} year={2024} month={8} date={11} />
    </div>
  );
}
