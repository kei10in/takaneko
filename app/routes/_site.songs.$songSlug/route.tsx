import { LoaderFunctionArgs, NavLink, Outlet } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb.tsx";
import { SongMeta } from "~/features/songs/SongMeta.ts";
import { ALL_SONGS } from "~/features/songs/songs.ts";
import { useSongLives } from "~/features/songs/useSongLives.ts";
import type { Route } from "./+types/route.ts";
import { Credit } from "./Credit.tsx";
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
  const youtubeEmbedUrl = SongMeta.youtubeEmbedUrl(track);
  const tabs = [
    { name: "概要", to: `/songs/${track.slug}` },
    { name: "統計", to: `/songs/${track.slug}/stats` },
    { name: "ライブ", to: `/songs/${track.slug}/lives` },
  ];

  return (
    <div>
      <div className="bg-zinc-900">
        <div className="container mx-auto lg:max-w-5xl">
          {youtubeEmbedUrl == undefined ? null : (
            // YouTube の公式プレイヤーの再生・認証機能を維持するため sandbox は指定しません。
            // oxlint-disable-next-line react/iframe-missing-sandbox
            <iframe
              className="aspect-video w-full"
              src={youtubeEmbedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>
      </div>

      <div className="container mx-auto lg:max-w-5xl">
        <div className="px-4 py-4">
          <Breadcrumb
            items={[
              { label: "たかねこの", to: "/" },
              { label: "楽曲", to: "/songs" },
            ]}
          />
        </div>

        <section className="px-4 py-20">
          <h1 className="page-heading">{track.name}</h1>

          {track.digitalRelease && (
            <p className="mt-1 text-sm text-nadeshiko-700">
              {track.digitalRelease.replace(/-/gu, ".")} <span className="">release</span>
            </p>
          )}

          <div className="mt-8">
            <Credit song={track} />
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
