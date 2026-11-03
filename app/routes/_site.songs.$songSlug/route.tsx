import { LoaderFunctionArgs, NavLink, Outlet } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb.tsx";
import { ThumbnailImage } from "~/components/thumbnail-image/ThumbnailImage.tsx";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import { useSongLives } from "~/features/songs/useSongLives.ts";
import type { Route } from "./+types/route.ts";
import { SongOutletContext } from "./useSongOutletContext.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { songSlug } = params;

  if (songSlug == undefined) {
    throw new Response("", { status: 404 });
  }

  const track = ALL_SONGS.find((x) => x.slug === songSlug);

  if (track == undefined) {
    throw new Response("", { status: 404 });
  }

  return { track };
};

export default function Component({ loaderData }: Pick<Route.ComponentProps, "loaderData">) {
  const { track } = loaderData;
  const { data: performances, isLoading } = useSongLives(track.slug);
  const outletContext: SongOutletContext = { track, performances, isLoading };
  const tabs = [
    { name: "概要", to: `/songs/${track.slug}` },
    { name: "ビデオ", to: `/songs/${track.slug}/videos` },
    { name: "ライブ", to: `/songs/${track.slug}/lives` },
    { name: "統計", to: `/songs/${track.slug}/stats` },
  ];

  return (
    <div>
      <div className="container mx-auto lg:max-w-5xl">
        <div className="px-4 py-4">
          <Breadcrumb
            items={[
              { label: "たかねこの", to: "/" },
              { label: "楽曲", to: "/songs" },
            ]}
          />
        </div>

        <section className="px-4 py-12">
          <div className={"mb-4 flex justify-between gap-4"}>
            <div className="space-y-1">
              <h1 className="page-heading">{track.name}</h1>

              {track.digitalRelease && (
                <p className="page-description">
                  {track.digitalRelease.replace(/-/gu, ".")} <span className="">release</span>
                </p>
              )}
            </div>
            <div className="my-1 size-20 shrink-0 sm:size-24 lg:size-32">
              {track.coverArt && (
                <ThumbnailImage
                  src={track.coverArt}
                  alt={`${track.name}のアートワーク`}
                  className="size-full rounded-2xl bg-white object-contain shadow-xl shadow-zinc-100"
                />
              )}
            </div>
          </div>

          <nav
            aria-label="楽曲詳細"
            className="hidden-scrollbar -mx-4 mt-2 flex items-center gap-2 overflow-x-scroll mask-x-from-[calc(100%-1rem)] px-4 py-4"
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end
                preventScrollReset
                className="flex-none rounded-full bg-white px-4 py-2 text-zinc-700 outline-none hover:bg-zinc-100/50 aria-[current=page]:bg-zinc-100"
              >
                <span className="text-center text-base select-none">{tab.name}</span>
              </NavLink>
            ))}
          </nav>

          <Outlet context={outletContext} />
        </section>
      </div>
    </div>
  );
}
