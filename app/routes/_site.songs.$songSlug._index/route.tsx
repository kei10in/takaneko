import { BsHeadphones, BsPlayBtnFill } from "react-icons/bs";
import { HiInformationCircle, HiLink } from "react-icons/hi2";
import { Link } from "react-router";
import { YouTubeEmbedPlayer } from "~/components/YouTubeEmbedPlayer.tsx";
import { AppleMusicIcon } from "~/components/logos/AppleMusicIcon.tsx";
import { SpotifyIcon } from "~/components/logos/SpotifyIcon.tsx";
import { YouTubeMusicIcon } from "~/components/logos/YouTubeMusicIcon.tsx";
import { SongMeta } from "~/features/songs/SongMeta.ts";
import { useSongOutletContext } from "~/routes/_site.songs.$songSlug/useSongOutletContext.ts";
import { displayDate } from "~/utils/dateDisplay.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import type { Route } from "./+types/route.ts";

export const meta: Route.MetaFunction = ({ matches }) => {
  const track = matches[2].loaderData?.track;
  const title = formatTitle(track?.name ?? "楽曲が見つかりません");
  const description =
    track == undefined
      ? "高嶺のなでしこの楽曲情報。"
      : `高嶺のなでしこ「${track.name}」の楽曲情報。MV・Dance Performance Video・歌ってみた、制作クレジットやリリース情報を掲載しています。`;

  return [{ title }, { name: "description", content: description }];
};

export default function Component() {
  const { track } = useSongOutletContext();
  const video = SongMeta.youtubeVideo(track);

  const streamings = [
    { Icon: SpotifyIcon, url: track?.recordings?.[0]?.spotify?.[0], name: "Spotify" },
    { Icon: AppleMusicIcon, url: track?.recordings?.[0]?.appleMusic?.[0], name: "Apple Music" },
    {
      Icon: YouTubeMusicIcon,
      url: track?.recordings?.[0]?.youtubeMusic?.[0],
      name: "YouTube Music",
    },
    {
      Icon: DistributorIcon,
      url: track?.recordings?.[0]?.tunecore?.[0] ?? track?.recordings?.[0]?.linkfire?.[0],
      name: "その他",
    },
  ];

  return (
    <div className="mt-8 space-y-8 px-4">
      <section>
        <h2 className="section-heading">
          <span className="flex items-center gap-2">
            <BsHeadphones className="inline-block text-gray-400" aria-hidden="true" />
            <span>ストリーミング</span>
          </span>
        </h2>
        {streamings.every(({ url }) => url == undefined) ? (
          <div className="mt-4 flex aspect-video h-32 w-full items-center justify-center rounded-3xl bg-zinc-100 text-zinc-700">
            <p>ストリーミングサービスでの配信はありません。</p>
          </div>
        ) : (
          <ul className="mt-2 grid grid-cols-4 items-stretch gap-1">
            {streamings.map(({ Icon, url, name }) =>
              url == undefined ? null : (
                <li key={name}>
                  <Link
                    className="block h-full space-y-2 rounded-3xl bg-white px-2 py-6 transition-[scale] hover:scale-110"
                    to={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="mx-auto block size-10 lg:size-12" aria-hidden="true" />
                    <p className="mx-auto line-clamp-2 w-fit text-center text-sm lg:text-base">
                      {name}
                    </p>
                  </Link>
                </li>
              ),
            )}
          </ul>
        )}
      </section>

      <section>
        <h2 className="section-heading">
          <span className="flex items-center gap-2">
            <BsPlayBtnFill className="inline-block text-gray-400" aria-hidden="true" />
            <span>ビデオ</span>
          </span>
        </h2>
        <div className="pt-4 pb-8">
          {video == undefined ? (
            <div className="mt-4 flex aspect-video w-full items-center justify-center rounded-3xl bg-zinc-100 text-zinc-700">
              <p>ミュージックビデオは公開されていません。</p>
            </div>
          ) : (
            <YouTubeEmbedPlayer videoId={video.videoId} />
          )}
        </div>
      </section>

      <section aria-label="情報" className="mb-16">
        <h2 className="section-heading">
          <span className="flex items-center gap-2">
            <HiInformationCircle className="inline-block text-gray-400" aria-hidden="true" />
            <span>情報</span>
          </span>
        </h2>
        <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 divide-zinc-200 px-2 lg:grid-cols-2">
          {[
            { label: "作詞", value: track.lyricsBy },
            { label: "作曲", value: track.composedBy },
            { label: "編曲", value: track.arrangedBy },
            { label: "振付", value: track.choreographedBy },
          ].map(({ label, value }) =>
            value == undefined ? null : (
              <div key={label}>
                <dt className="text-zinc-400">{label}</dt>
                <dd className="text-zinc-900">{value}</dd>
              </div>
            ),
          )}
          {[
            { label: "配信リリース", date: track.digitalRelease },
            { label: "MV / DPV 公開", date: track.videoRelease },
            { label: "ライブ初披露", date: track.liveDebut },
          ].map(({ label, date }) =>
            date == undefined ? null : (
              <div key={label}>
                <dt className="text-zinc-400">{label}</dt>
                <dd className="text-zinc-900">
                  <time dateTime={date}>{displayDate(date)}</time>
                </dd>
              </div>
            ),
          )}
        </dl>
      </section>
    </div>
  );
}

const DistributorIcon = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <HiLink className="size-80/100 text-zinc-500" />
    </div>
  );
};
