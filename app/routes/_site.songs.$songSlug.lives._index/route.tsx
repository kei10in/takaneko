import { Fragment } from "react";
import { BsMicFill } from "react-icons/bs";
import { sectionHeading } from "~/components/styles.ts";
import { useSongOutletContext } from "~/routes/_site.songs.$songSlug/useSongOutletContext.ts";
import { LiveCard } from "./LiveCard.tsx";
import { LiveSkeleton } from "./LiveSkeleton.tsx";

export default function Component() {
  const { performances, isLoading } = useSongOutletContext();
  const lives = performances?.lives ?? [];

  return (
    <section className="mt-8">
      <h2 className={sectionHeading("sticky top-0 z-10 bg-white/90 py-2 lg:top-(--header-height)")}>
        <span className="flex items-center gap-2">
          <BsMicFill className="inline-block text-gray-400" />
          <span>ライブ</span>
        </span>
      </h2>

      <ul className="mt-4 space-y-2">
        {isLoading &&
          [1, 2, 3].map((x) => (
            <li key={x}>
              <LiveSkeleton />
            </li>
          ))}
        {!isLoading && lives.length == 0 && (
          <li>
            <p className="p-1 text-gray-500">この楽曲を披露したライブが見つかりませんでした。</p>
          </li>
        )}
        {lives.map(({ segments, event: e }, i) => (
          <Fragment key={i}>
            {segments.map((segment, j) => (
              <li key={j}>
                <LiveCard event={e} segment={segment} />
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </section>
  );
}
