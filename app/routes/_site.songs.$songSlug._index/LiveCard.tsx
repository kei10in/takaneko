import { GiMicrophone } from "react-icons/gi";
import { HiOutlineMapPin } from "react-icons/hi2";
import { Link } from "react-router";
import { LiveTypeBadge } from "~/components/SmallBadges.tsx";
import { ThumbnailImage } from "~/components/thumbnail-image/ThumbnailImage.tsx";
import { memberNameToEmoji } from "~/features/profile/memberNameToEmoji.ts";
import { SimpleSongActivity } from "~/features/songs/types.ts";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay.ts";

interface Props {
  event: SimpleSongActivity["event"];
  segment: SimpleSongActivity["segments"][number];
}

export const LiveCard: React.FC<Props> = ({ event, segment }: Props) => {
  const members =
    segment.members
      ?.flatMap((m) => {
        const s = memberNameToEmoji(m);
        return s == "" ? [] : [s];
      })
      .join("") ?? "";

  return (
    <Link
      to={`/events/${event.slug}`}
      className="group block w-full overflow-hidden rounded-3xl border border-zinc-500/10 bg-white p-2 text-left shadow-xl shadow-black/2 focus-visible:outline-2 focus-visible:outline-nadeshiko-600"
    >
      <div className="flex items-start gap-2">
        <div className="relative w-24 flex-none self-stretch overflow-hidden rounded-2xl">
          {event.image != undefined ? (
            <div className="absolute inset-0 h-full w-full bg-zinc-100 p-2">
              <ThumbnailImage
                src={event.image.path}
                loading="lazy"
                className="h-full w-full object-contain text-xs"
                alt={event.title}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-nadeshiko-100 text-nadeshiko-800">
              <GiMicrophone className="text-3xl" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1 px-2 py-0.5">
          <p className="text-sm text-zinc-500">{displayDateWithDayOfWeek(event.date)}</p>

          <h3 className="line-clamp-2 leading-snug font-semibold transition-colors group-hover:text-nadeshiko-800">
            {segment.actTitle ? `${event.title} - ${segment.actTitle}` : event.title}
          </h3>

          <p className="flex min-w-0 items-center gap-1 text-sm text-zinc-500">
            <HiOutlineMapPin className="size-4 flex-none" />
            <span className="line-clamp-1">
              {event.region} {event.location}
            </span>
          </p>

          <p className="flex flex-wrap items-center gap-1 text-xs text-zinc-500">
            <span>
              {segment.section == "main" ? "M" : "EN"}
              {(segment.index + 1).toString().padStart(2, "0")}
            </span>
            <span> / </span>
            <span>{segment.costumeNames?.join("、") || "衣装不明"}</span>
            {members != "" && <span>by {members}</span>}
          </p>

          {event.liveType != undefined && (
            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              <LiveTypeBadge liveType={event.liveType} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
