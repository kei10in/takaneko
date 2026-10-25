import { clsx } from "clsx";
import { memo, useLayoutEffect, useRef, useState } from "react";
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
  scrollTop: number | undefined;
  onScrollPositionChange: (slug: string, scrollTop: number) => void;
}

export const SetlistEventDetail = memo(function SetlistEventDetail({
  result,
  showMatchedAct,
  scrollTop,
  onScrollPositionChange,
}: SetlistEventDetailProps) {
  const { event, matchedActIndexes } = result;
  const scrollContainerRef = useRef<HTMLElement>(null);
  // 保存位置の変更で再描画されても、マウント中のスクロールを巻き戻さない。
  const [initialScrollTop] = useState(() => scrollTop);

  useLayoutEffect(() => {
    if (scrollContainerRef.current != null && initialScrollTop != undefined) {
      scrollContainerRef.current.scrollTop = initialScrollTop;
    }
  }, [initialScrollTop]);

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer == null) {
      return;
    }
    const handleScroll = () => onScrollPositionChange(event.slug, scrollContainer.scrollTop);
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [event.slug, onScrollPositionChange]);
  const matchedActIndexSet = new Set(matchedActIndexes);
  const hasFirstPerformance = event.acts.some((act) =>
    act.setlist.some((segment) => segment.kind == "song" && segment.isFirstPerformance),
  );
  return (
    <>
      <div className="h-40 flex-none border-b border-zinc-100">
        <div className="flex h-full items-stretch gap-2 p-4">
          <div className="relative min-h-24 w-24 min-w-0 flex-none overflow-hidden rounded-2xl">
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
          <div className="flex min-w-0 flex-1 flex-col space-y-1 py-0.5 pl-2">
            <p className="line-clamp-1 text-sm text-zinc-500">
              {displayDateWithDayOfWeek(NaiveDate.parseUnsafe(event.date))}
            </p>

            <h2 className="line-clamp-2 text-lg leading-snug font-semibold" title={event.title}>
              {event.title}
            </h2>
            {event.location != undefined && (
              <p className="flex flex-none items-center gap-1 text-sm text-zinc-500">
                <HiOutlineMapPin aria-hidden="true" className="size-4 flex-none" />
                <span className="min-w-0 truncate" title={event.location}>
                  {event.location}
                </span>
              </p>
            )}
            <div className="flex flex-none flex-wrap items-center gap-1 pt-0.5 lg:pr-4">
              <LiveTypeBadge liveType={event.liveType} />
              {hasFirstPerformance && <FirstPerformanceBadge />}
            </div>
          </div>
        </div>
      </div>

      <div data-base-ui-swipe-ignore="" className="relative min-h-0 flex-1">
        <section
          ref={scrollContainerRef}
          key={event.slug}
          aria-label="曲のリスト"
          className={clsx(
            "h-full space-y-7 overflow-y-auto overscroll-contain px-4 pt-4 pb-20",
            "inset-shadow-[0_3rem_3rem_-3rem_var(--tw-inset-shadow-color),0_-3rem_3rem_-3rem_var(--tw-inset-shadow-color)] inset-shadow-black/5",
          )}
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
        </section>
        <Link
          to={`/events/${event.slug}`}
          className="absolute right-4 bottom-4 z-10 inline-flex h-11 items-center gap-1 rounded-full bg-white/30 px-4 text-base shadow-md ring-1 ring-zinc-200/50 backdrop-blur-xs hover:bg-white/70"
        >
          <HiOutlineCalendarDays className="size-5 text-nadeshiko-600" />
          <span>イベント詳細</span>
          <HiChevronRight className="size-5 text-nadeshiko-600" />
        </Link>
      </div>
    </>
  );
});
