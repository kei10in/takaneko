import { validateEventMeta } from "~/features/events/eventMeta";
import { EventModule } from "~/features/events/eventModule";
import { EventType } from "~/features/events/EventType";

export const buildEventModule = ({
  slug,
  date,
  updatedAt,
}: {
  slug: string;
  date: string;
  updatedAt?: string;
}): EventModule => {
  const meta = validateEventMeta({
    summary: "Test Event",
    category: EventType.LIVE,
    date,
    updatedAt,
  });

  if (meta == undefined) {
    throw new Error("Invalid test event meta");
  }

  return {
    slug,
    filename: `app/features/events/${date.slice(0, 4)}/${date.slice(5, 7)}/${slug}.tsx`,
    meta,
    Content: () => null,
  };
};
