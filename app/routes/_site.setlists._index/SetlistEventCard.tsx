import { GiMicrophone } from "react-icons/gi";
import { HiOutlineMapPin } from "react-icons/hi2";
import { FirstPerformanceBadge } from "~/components/IconChip.tsx";
import { LiveTypeBadge, TextBadge } from "~/components/SmallBadges.tsx";
import { ThumbnailImage } from "~/components/thumbnail-image/ThumbnailImage.tsx";
import { SetlistEvent } from "~/features/setlists/types.ts";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";

interface SetlistEventCardProps {
  event: SetlistEvent;
  onClick: () => void;
}

export const SetlistEventCard = ({ event, onClick }: SetlistEventCardProps) => {
  const date = NaiveDate.parseUnsafe(event.date);
  const noSetlist = event.acts.every((act) => act.songCount == 0);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className="group block h-36 w-full overflow-hidden rounded-3xl border border-zinc-500/10 bg-white p-2 text-left shadow-xl shadow-black/2 focus-visible:outline-2 focus-visible:outline-nadeshiko-600"
    >
      <div className="flex h-full items-start gap-2">
        {/* Image */}
        <div className="relative min-h-24 w-24 flex-none self-stretch overflow-hidden rounded-2xl">
          {event.image != undefined ? (
            <div className="absolute inset-0 h-full w-full bg-zinc-100 p-2">
              <ThumbnailImage
                src={event.image?.path}
                loading="lazy"
                className="h-full w-full object-contain text-xs"
                alt={event.title}
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-nadeshiko-100 text-nadeshiko-800">
              <GiMicrophone className="text-3xl" />
            </div>
          )}
        </div>

        {/* Event Summary */}
        <div className="min-w-0 flex-1 space-y-1 px-2 py-0.5">
          <div className="line-clamp-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            {displayDateWithDayOfWeek(date)}
          </div>

          <h2 className="line-clamp-2 leading-snug font-semibold transition-colors group-hover:text-nadeshiko-800">
            {event.title}
          </h2>

          <div className="line-clamp-1 flex items-center text-sm text-zinc-500">
            {event.location != undefined && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <HiOutlineMapPin className="size-4 flex-none" />
                <span className="line-clamp-1">{event.location}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <LiveTypeBadge liveType={event.liveType} />

            {containsFirstPerformanceSong(event) && <FirstPerformanceBadge />}
            {noSetlist && <TextBadge text="未登録" />}
            {!noSetlist && event.acts.some((act) => act.songCount == 0) && (
              <TextBadge text="未登録あり" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
const containsFirstPerformanceSong = (event: SetlistEvent): boolean => {
  return event.acts.some((act) =>
    act.setlist.some((segment) => segment.kind == "song" && segment.isFirstPerformance),
  );
};
