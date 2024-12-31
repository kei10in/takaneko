import { Link, MetaFunction } from "@remix-run/react";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { ALL_SONGS } from "~/features/songs/songs";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("楽曲一覧") },
    {
      name: "description",
      content: "高嶺のなでしこの楽曲の一覧です。",
    },
  ];
};

export default function Component() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="my-2 text-5xl font-semibold text-nadeshiko-800 lg:mt-12">
          楽曲一覧 (開発中)
        </h1>

        <p>楽曲の詳細と各楽曲がどのライブで披露されたのかを確認できます。</p>

        <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-8">
          {ALL_SONGS.map((track) => (
            <li key={track.slug}>
              <div className="w-40">
                <Link to={`/songs/${track.slug}`}>
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    {track.image == undefined ? (
                      <div className="flex h-40 w-40 items-center justify-center bg-gray-100">
                        <BsMusicNoteBeamed className="h-20 w-20 text-gray-300" />
                      </div>
                    ) : (
                      <img
                        src={track.image.path}
                        alt={track.name}
                        className="h-40 w-40 object-cover"
                      />
                    )}
                  </div>
                </Link>
                <div className="mt-2 text-sm">
                  <Link to={`/songs/${track.slug}`}>{track.name}</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
