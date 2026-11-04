import { Fragment } from "react";
import { BsMicFill } from "react-icons/bs";
import { sectionHeading } from "~/components/styles.ts";
import { OgpSiteName } from "~/constants.ts";
import { canonicalUrl } from "~/metadata/canonicalUrl.ts";
import { useSongOutletContext } from "~/routes/_site.songs.$songSlug/useSongOutletContext.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import type { Route } from "./+types/route.ts";
import { LiveCard } from "./LiveCard.tsx";
import { LiveSkeleton } from "./LiveSkeleton.tsx";

export const meta: Route.MetaFunction = ({ matches, location }) => {
  const track = matches[2].loaderData?.track;
  if (track == undefined) {
    return [{ title: formatTitle("楽曲が見つかりません") }];
  }

  const title = formatTitle(`${track.name} - ライブ披露履歴`);
  const description = `高嶺のなでしこの楽曲「${track.name}」を披露したライブの一覧です。公演日・会場・セットリストの曲順・衣装・参加メンバーを確認できます。`;
  const canonical = canonicalUrl(location.pathname);
  const image = canonicalUrl("/takanekono-card.png");

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:site_name", content: OgpSiteName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "ja_JP" },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@takanekofan" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
};

export default function Component() {
  const { performances, isLoading } = useSongOutletContext();
  const lives = performances?.lives ?? [];

  return (
    <section>
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
