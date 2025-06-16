import { Link, MetaFunction } from "react-router";
import { ALL_SONGS } from "~/features/songs/songs";
import { formatTitle } from "~/utils/htmlHeader";
import { Thumbnail } from "./thumbnail";

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
        <h1 className="text-nadeshiko-800 my-2 text-5xl font-semibold lg:mt-12">楽曲一覧</h1>

        <p>楽曲の詳細と各楽曲がどのライブで披露されたのかを確認できます。</p>

        <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-8">
          {ALL_SONGS.map((track) => (
            <li key={track.slug}>
              <div className="w-40">
                <Link to={`/songs/${track.slug}`}>
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <Thumbnail track={track} />
                  </div>
                </Link>
                <div className="mt-2 text-sm">
                  <Link to={`/songs/${track.slug}`}>{track.name}</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <section className="mt-12">
          <h2 className="mb-2 text-2xl font-semibold text-gray-600">その他</h2>
          <ul>
            <li>
              <Link to="/songs/stats" className="text-nadeshiko-800 hover:underline">
                楽曲の統計情報
              </Link>
            </li>
          </ul>
        </section>
      </section>
    </div>
  );
}
