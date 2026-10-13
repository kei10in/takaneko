import { memo } from "react";
import { GiMicrophone } from "react-icons/gi";
import { HiChevronRight, HiOutlineCalendarDays, HiOutlineMapPin } from "react-icons/hi2";
import { Link } from "react-router";
import { FirstPerformanceBadge } from "~/components/IconChip.tsx";
import { Setlist } from "~/components/Setlist.tsx";
import { LiveTypeBadge } from "~/components/SmallBadges.tsx";
import { ThumbnailImage } from "~/components/thumbnail-image/ThumbnailImage.tsx";
import { SetlistSearchResult } from "~/features/setlists/types.ts";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";

interface SetlistEventDetailProps {
  result: SetlistSearchResult;
  showMatchedAct: boolean;
}

export const SetlistEventDetail = memo(function SetlistEventDetail({
  result,
  showMatchedAct,
}: SetlistEventDetailProps) {
  const { event, matchedActIndexes } = result;
  const matchedActIndexSet = new Set(matchedActIndexes);
  const hasFirstPerformance = event.acts.some((act) =>
    act.setlist.some((segment) => segment.kind == "song" && segment.isFirstPerformance),
  );
  return (
    <>
      <div className="h-44 flex-none border-b border-zinc-100">
        <div className="flex h-full items-stretch gap-2">
          <div className="flex flex-none py-2 pl-2 lg:py-4 lg:pl-4">
            <div className="relative min-h-24 w-24 overflow-hidden rounded-2xl">
              {event.image != undefined ? (
                <div className="absolute inset-0 h-full w-full bg-zinc-100 p-2">
                  <ThumbnailImage
                    src={event.image.path}
                    className="h-full w-full object-contain text-xs"
                    alt={event.title}
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-nadeshiko-100 text-nadeshiko-800">
                  <GiMicrophone aria-hidden="true" className="text-3xl" />
                </div>
              )}
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col space-y-1 pb-2.5 lg:pb-4.5">
            <div className="flex flex-none items-start">
              <div className="min-w-0 flex-1 space-y-1 px-2 pt-2.5 lg:pt-4.5">
                <p className="text-sm text-zinc-500">
                  {displayDateWithDayOfWeek(NaiveDate.parseUnsafe(event.date))}
                </p>
                <h2 className="line-clamp-2 text-lg leading-snug font-semibold" title={event.title}>
                  {event.title}
                </h2>
              </div>
            </div>
            {event.location != undefined && (
              <p className="flex flex-none items-center gap-1 px-2 text-sm text-zinc-500">
                <HiOutlineMapPin aria-hidden="true" className="size-4 flex-none" />
                <span className="min-w-0 truncate" title={event.location}>
                  {event.location}
                </span>
              </p>
            )}
            <div className="flex flex-1 flex-wrap items-center gap-1 px-2 pt-0.5 lg:pr-4">
              <LiveTypeBadge liveType={event.liveType} />
              {hasFirstPerformance && <FirstPerformanceBadge />}
            </div>
            <div className="flex flex-row-reverse">
              <Link
                to={`/events/${event.slug}`}
                className="inline-flex h-8 flex-none items-center gap-1 rounded-full px-2 text-sm hover:bg-zinc-100"
              >
                <HiOutlineCalendarDays className="size-4.5 text-nadeshiko-600" />
                <span>イベント詳細</span>
                <HiChevronRight className="text-nadeshiko-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        key={event.slug}
        className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain px-2 py-4 inset-shadow-[0_3rem_3rem_-3rem_var(--tw-inset-shadow-color),0_-3rem_3rem_-3rem_var(--tw-inset-shadow-color)] inset-shadow-black/5 sm:py-6 lg:px-4"
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
