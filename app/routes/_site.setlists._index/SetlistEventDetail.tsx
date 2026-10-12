import { memo } from "react";
import { HiChevronRight } from "react-icons/hi2";
import { Link } from "react-router";
import { Setlist } from "~/components/Setlist.tsx";
import { LiveTypeBadge } from "~/components/SmallBadges.tsx";
import { XMarkButton } from "~/components/XMarkButton.tsx";
import { SetlistSearchResult } from "~/features/setlists/types.ts";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";

interface SetlistEventDetailProps {
  result: SetlistSearchResult;
  showMatchedAct: boolean;
  onClose: () => void;
}

export const SetlistEventDetail = memo(function SetlistEventDetail({
  result,
  showMatchedAct,
  onClose,
}: SetlistEventDetailProps) {
  const { event, matchedActIndexes } = result;
  const matchedActIndexSet = new Set(matchedActIndexes);
  return (
    <>
      <div className="max-h-[45%] flex-none overflow-y-auto border-b border-zinc-100 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <p className="text-sm text-zinc-500">
              {displayDateWithDayOfWeek(NaiveDate.parseUnsafe(event.date))}
            </p>
            <h2 className="line-clamp-2 text-lg leading-tight font-semibold" title={event.title}>
              {event.title}
            </h2>
            {event.location != undefined && (
              <p className="text-sm text-zinc-500">{event.location}</p>
            )}
            <LiveTypeBadge liveType={event.liveType} />
          </div>
          <XMarkButton aria-label="閉じる" onClick={onClose} className="flex-none" />
        </div>
        <Link
          to={`/events/${event.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-sm text-nadeshiko-700"
        >
          イベント詳細
          <HiChevronRight />
        </Link>
      </div>
      <div
        key={event.slug}
        className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain p-4 sm:p-6"
      >
        {event.acts.map((act, index) => (
          <section key={index} className="space-y-2">
            {(event.acts.length > 1 || act.title != undefined) && (
              <div className="flex items-center gap-2">
                <h3 className="line-clamp-1 min-w-0 flex-1 text-base font-semibold text-gray-700">
                  {act.title ?? `ステージ ${index + 1}`}
                </h3>
                {showMatchedAct && matchedActIndexSet.has(index) && (
                  <span className="flex-none rounded-full bg-nadeshiko-100 px-2 py-0.5 text-xs text-nadeshiko-800">
                    該当
                  </span>
                )}
              </div>
            )}

            {act.songCount == 0 ? (
              <div className="z-50 rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-500">
                セットリスト未登録
              </div>
            ) : (
              <Setlist setlist={act.setlist} links={act.links} />
            )}
          </section>
        ))}
      </div>
    </>
  );
});
