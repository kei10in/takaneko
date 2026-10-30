import { clsx } from "clsx";
import { BsCalendar, BsGeo } from "react-icons/bs";
import { Link } from "react-router";
import { liveTypeColor } from "~/features/events/EventType.ts";
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
    <div className="flex items-stretch gap-2 p-1">
      <div className={clsx("w-1 flex-none rounded-full", liveTypeColor(event.liveType))} />
      <div className="text-xs">
        <p className="text-sm">
          <Link to={`/events/${event.slug}`}>
            {segment.actTitle ? `${event.title} - ${segment.actTitle}` : event.title}
          </Link>
        </p>
        <p className="flex items-center gap-1 text-gray-400">
          <BsCalendar className="inline flex-none text-xs" />
          <span className="line-clamp-1">{displayDateWithDayOfWeek(event.date)}</span>
        </p>
        <p className="flex items-center gap-1 text-gray-400">
          <BsGeo className="inline flex-none text-xs" />
          <span className="line-clamp-1">
            {event.region} {event.location}
          </span>
        </p>
        <p className="flex items-center gap-1 text-gray-400">
          <span>
            {segment.section == "main" ? "M" : "EN"}
            {(segment.index + 1).toString().padStart(2, "0")}
          </span>
          <span> / </span>
          <span className="line-clamp-1">{segment.costumeNames?.join("、") || "衣装不明"}</span>
          {members != "" && <span className="line-clamp-1">by {members}</span>}
        </p>
      </div>
    </div>
  );
};
