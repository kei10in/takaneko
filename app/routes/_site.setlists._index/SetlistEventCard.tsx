import { CloseButton, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { clsx } from "clsx";
import { GiMicrophone } from "react-icons/gi";
import {
  HiChevronDown,
  HiChevronRight,
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineMusicalNote,
  HiOutlineStar,
  HiXMark,
} from "react-icons/hi2";
import { Link } from "react-router";
import { Setlist } from "~/features/events/components/Setlist";
import { liveTypeColor, liveTypeLabel } from "~/features/events/EventType";
import { SetlistEvent } from "~/features/setlists/types";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

interface SetlistEventCardProps {
  event: SetlistEvent;
  matchedActIndexes: number[];
  showMatchedAct: boolean;
}

export const SetlistEventCard: React.FC<SetlistEventCardProps> = ({
  event,
  matchedActIndexes,
  showMatchedAct,
}: SetlistEventCardProps) => {
  const date = NaiveDate.parseUnsafe(event.date);
  const matchedActIndexSet = new Set(matchedActIndexes);
  const eventUrl = `/events/${event.slug}`;

  return (
    <div
      className={clsx(
        "group box-border overflow-hidden rounded-3xl border border-zinc-500/10 bg-white shadow-xl shadow-black/2",
      )}
    >
      <Disclosure>
        {({ open }) => (
          <div>
            <DisclosureButton className="block w-full p-2 text-left focus-visible:outline-none">
              <div className="flex items-start gap-2">
                {/* Image */}
                <div className="relative min-h-24 w-24 flex-none self-stretch overflow-hidden rounded-2xl">
                  {event.image != undefined ? (
                    <div className="absolute inset-0 h-full w-full bg-zinc-100 p-2">
                      <img
                        src={event.image?.path}
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
                <div className="min-w-0 flex-1 space-y-1 py-0.5 pl-2">
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

                  <div className="flex items-center gap-1 pt-0.5 text-xs">
                    <span
                      className={clsx(
                        "inline-block rounded-full px-2 text-white",
                        liveTypeColor(event.liveType),
                      )}
                    >
                      {liveTypeLabel(event.liveType)}
                    </span>
                    {!event.hasSetlist && (
                      <span className="inline-block rounded-full bg-zinc-100 px-2 text-zinc-500">
                        未登録
                      </span>
                    )}
                    {event.hasSetlist && event.hasMissingSetlist && (
                      <span className="inline-block rounded-full bg-zinc-100 px-2 text-zinc-500">
                        未登録あり
                      </span>
                    )}
                  </div>
                </div>

                {/* Chevron */}
                <div className="flex size-8 flex-none items-center justify-center rounded-full transition-colors group-hover:bg-zinc-500/5">
                  <HiChevronDown
                    className={clsx(
                      "size-5 text-zinc-500 transition-transform",
                      open && "-rotate-180",
                    )}
                  />
                </div>
              </div>
            </DisclosureButton>

            <DisclosurePanel
              transition
              className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-200 ease-in-out data-closed:grid-rows-[0fr]"
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  className={clsx(
                    "mb-2 border-y border-zinc-100 px-4 inset-shadow-black/5",
                    "inset-shadow-[0_3rem_3rem_-3rem_var(--tw-inset-shadow-color),0_-3rem_3rem_-3rem_var(--tw-inset-shadow-color)]",
                  )}
                >
                  <div className="my-6 space-y-7">
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

                        {act.hasSetlist ? (
                          <Setlist setlist={act.setlist} links={act.links} />
                        ) : (
                          <div className="z-50 rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-500">
                            セットリスト未登録
                          </div>
                        )}
                      </section>
                    ))}
                  </div>
                  <div className="my-1 text-right">
                    <CloseButton className="inline-flex items-center justify-center gap-1 rounded-full text-sm text-zinc-500">
                      <HiXMark className="size-4" />
                      <span>閉じる</span>
                    </CloseButton>
                  </div>
                </div>
              </div>
            </DisclosurePanel>

            <div className="flex items-center px-2 pb-2 text-sm">
              <div className="flex min-w-0 flex-1 items-center">
                <div className="flex h-8 items-center gap-1 rounded-full px-2 text-zinc-600">
                  <HiOutlineMusicalNote className="size-4 text-nadeshiko-600" />
                  <span>{event.songCount} 曲</span>
                </div>

                {event.actCount > 1 && (
                  <div className="flex h-8 items-center gap-1 rounded-full px-2 text-zinc-600">
                    <HiOutlineStar className="size-4 text-nadeshiko-600" />
                    <span>{event.actCount} ステージ</span>
                  </div>
                )}
              </div>

              <div className="flex flex-none justify-end">
                <Link
                  className="flex h-8 items-center gap-1 rounded-full px-2 hover:bg-zinc-100"
                  to={eventUrl}
                >
                  <HiOutlineCalendarDays className="size-4.5 text-nadeshiko-600" />
                  <span>イベント詳細</span>
                  <HiChevronRight className="text-nadeshiko-600" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </Disclosure>
    </div>
  );
};
