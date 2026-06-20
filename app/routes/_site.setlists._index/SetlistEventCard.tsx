import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { clsx } from "clsx";
import { HiChevronDown, HiMusicalNote, HiOutlineMapPin } from "react-icons/hi2";
import { Link } from "react-router";
import { Setlist } from "~/features/events/components/Setlist";
import { liveTypeColor, liveTypeLabel } from "~/features/events/EventType";
import { SetlistEvent } from "~/features/setlists/setlists";
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
    <div className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <Disclosure>
        {({ open }) => (
          <div>
            <DisclosureButton className="block w-full px-4 py-4 text-left">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center">
                      {displayDateWithDayOfWeek(date)}
                    </span>
                    <span
                      className={clsx(
                        "inline-block rounded-full px-2 py-0.5 text-white",
                        liveTypeColor(event.liveType),
                      )}
                    >
                      {liveTypeLabel(event.liveType)}
                    </span>
                    {!event.hasSetlist && (
                      <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-gray-500">
                        セットリスト未登録
                      </span>
                    )}
                    {event.hasSetlist && event.hasMissingSetlist && (
                      <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-gray-500">
                        未登録あり
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2 line-clamp-2 text-lg font-semibold group-hover:text-nadeshiko-800">
                    {event.title}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    {event.location != undefined && (
                      <span className="inline-flex min-w-0 items-center gap-1">
                        <HiOutlineMapPin className="flex-none" />
                        <span className="line-clamp-1">{event.location}</span>
                      </span>
                    )}
                    {event.region != undefined && <span>{event.region}</span>}
                  </div>
                </div>

                <div className="flex flex-none items-center gap-2 pt-1">
                  <HiChevronDown className={clsx("transition-transform", open && "-rotate-180")} />
                </div>
              </div>
            </DisclosureButton>

            <DisclosurePanel
              transition
              className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-200 ease-in-out data-closed:grid-rows-[0fr]"
            >
              <div className="m-h-0 overflow-hidden">
                <div className="bg-zinc-500/2, border-y border-zinc-100 px-4 py-5">
                  <div className="space-y-7">
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
                          <div className="rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-500">
                            セットリスト未登録
                          </div>
                        )}
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            </DisclosurePanel>
          </div>
        )}
      </Disclosure>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1">
          <HiMusicalNote />
          {event.actCount > 1 ? `${event.actCount} 公演 / ` : ""}
          {event.songCount} 曲
        </div>

        <div className="flex justify-end">
          <Link
            className="inline-flex items-center gap-1 text-sm font-semibold text-nadeshiko-800"
            to={eventUrl}
          >
            <span>イベント詳細</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
