import { clsx } from "clsx";
import { HiMusicalNote } from "react-icons/hi2";
import { LoaderFunctionArgs, NavLink, Outlet, useMatch } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb.tsx";
import { ThumbnailImage } from "~/components/thumbnail-image/ThumbnailImage.tsx";
import { SongMeta } from "~/features/songs/SongMeta.ts";
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
  const page = useMatch("/songs/:songSlug/:page")?.params.page;
  const currentTab =
    page == undefined ? undefined : tabs.find((tab) => tab.to === `/songs/${track.slug}/${page}`);

  const thumbnail = SongMeta.youtubeImage(track);

  return (
    <section className="mx-auto">
      <div className="relative h-52 lg:h-64">
        <div className="relative h-full overflow-hidden">
          {thumbnail != undefined && (
            <img
              src={thumbnail.maxResDefault.url}
              alt={`${track.name}のサムネイル`}
              className="h-96/100 w-full mask-b-from-25% mask-b-to-80% object-cover"
            />
          )}
          <div className="absolute inset-0 h-full bg-white/40 backdrop-blur-sm"></div>
        </div>

        <div className="absolute inset-0">
          <div className="container mx-auto flex h-full flex-col justify-between lg:max-w-5xl">
            <div className="px-4 py-2 drop-shadow-[0_0_0.25rem_white]">
              <Breadcrumb
                items={[
                  { label: "楽曲", to: "/songs" },
                  { label: track.name, to: `/songs/${track.slug}` },
                  ...(currentTab == undefined
                    ? []
                    : [{ label: currentTab.name, to: currentTab.to }]),
                ]}
              />
            </div>

            <div className={"flex items-center justify-start gap-4 px-4 py-4"}>
              <div className="my-1 size-26 shrink-0 lg:size-32">
                {track.coverArt ? (
                  <ThumbnailImage
                    src={track.coverArt}
                    alt={`${track.name}のアートワーク`}
                    className="size-full rounded-[30%] bg-white object-contain ring-4 shadow-zinc-100 ring-white/50"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center rounded-[20%] bg-nadeshiko-200">
                    <HiMusicalNote className="size-1/2 text-nadeshiko-700" />
                  </div>
                )}
              </div>
              <div>
                <h1 className={clsx("page-heading line-clamp-2")}>{track.name}</h1>

                {track.digitalRelease && (
                  <p className="page-description line-clamp-1 text-shadow-lg text-shadow-white">
                    {track.digitalRelease.replace(/-/gu, ".")} <span className="">release</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-6 pb-8 lg:max-w-5xl">
        <nav
          aria-label="楽曲詳細"
          className="hidden-scrollbar flex items-center gap-2 overflow-x-scroll mask-x-from-[calc(100%-1rem)] px-4"
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
      </div>
    </section>
  );
}
