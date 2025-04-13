import { BsChevronLeft, BsChevronRight, BsYoutube } from "react-icons/bs";
import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { MemberIcon } from "~/components/MemberIcon";
import { getAllMedia } from "~/features/media/allMedia";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { findFirstNonEmpty } from "~/utils/findFirstNonEmpty";
import { formatTitle } from "~/utils/htmlHeader";
import { ogp } from "~/utils/ogp/ogp";
import { validateYouTubeOEmbedResponse } from "~/utils/youtube/youtubeOEmbed";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("出演情報") },
    {
      name: "description",
      content: "高嶺のなでしこが出演しているメディアの一覧です。",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const ps = url.searchParams.get("p");
  const pp = Number.parseInt(ps ?? "1", 10);
  // ページネーションは 1 から始まるので、pp - 1 にしています。
  const p = Number.isNaN(pp) ? 0 : pp - 1;

  // Cloudflare Workers ではサブリクエストの上限があるため、ページネーションが必要
  // サブリクエストの上限はフリープランでは 50 リクエストになっているが、
  // どこかにひとつ見えていないリクエストがあるため 50 では失敗する。
  const PAGE_SIZE = 40;

  const oEmbedEndpoint = "https://www.youtube.com/oembed";

  const allMedia = getAllMedia();
  const total = Math.ceil(allMedia.length / PAGE_SIZE);
  const page = Math.max(0, Math.min(total, p));

  const metadataPromises = allMedia
    .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    .map(async (media) => {
      if (media.kind == "static") {
        return [
          {
            kind: "static",
            title: media.title,
            authorName: media.authorName,
            publishedAt: media.publishedAt,
            mediaUrl: media.mediaUrl,
            imageUrl: media.image.path,
            presents: media.presents ?? [],
          },
        ];
      } else if (media.kind == "ogp") {
        const metadata = await ogp(media.mediaUrl);

        const title = findFirstNonEmpty([metadata?.ogp?.title, media.title]);
        const authorName = findFirstNonEmpty([metadata?.ogp?.siteName, media.siteName]);
        const imageUrl = findFirstNonEmpty([metadata?.ogp?.image, media.image?.path]);
        const mediaUrl = findFirstNonEmpty([metadata?.ogp?.url, media.mediaUrl]);
        if (!title || !authorName || !imageUrl || !mediaUrl) {
          return [];
        }

        return [
          {
            kind: "ogp",
            title: title,
            authorName: authorName,
            publishedAt: media.publishedAt,
            mediaUrl: mediaUrl,
            imageUrl: imageUrl,
            presents: media.presents ?? [],
          },
        ];
      } else if (media.kind == "youtube") {
        const url = `${oEmbedEndpoint}?url=https://www.youtube.com/watch?v=${media.videoId}&format=json`;

        const response = await fetch(url);
        if (!response.ok) {
          return [];
        }
        const jsonData = await response.json();

        // Validate the response using the validate function
        const data = validateYouTubeOEmbedResponse(jsonData);
        if (!data) {
          return [];
        }

        const presents = (media.presents ?? []).flatMap((m) => {
          if (m == "高嶺のなでしこ") {
            return [];
          }
          return [m];
        });

        return [
          {
            kind: "youtube",
            title: data.title,
            authorName: data.author_name,
            publishedAt: media.publishedAt,
            mediaUrl: `https://youtu.be/${media.videoId}`,
            imageUrl: data.thumbnail_url,
            presents,
          },
        ];
      } else {
        return [];
      }
    });

  const items = (await Promise.all(metadataPromises)).flatMap((x) => x);
  return { page: page + 1, total, items };
};

export default function MediaIndex() {
  const metadata = useLoaderData<typeof loader>();
  const { page, total, items } = metadata;

  return (
    <div className="container mx-auto max-w-3xl">
      <section className="p-4">
        <h1 className="text-nadeshiko-800 my-4 text-5xl font-semibold lg:mt-12">メディア</h1>
        <ul className="max-w-2xl space-y-6 py-2">
          {items.map((video) => {
            return (
              <li key={video.mediaUrl}>
                <Link
                  to={video.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-600"
                >
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <h2 className="text-md line-clamp-3 font-semibold">{video.title}</h2>
                      <p className="line-clamp-1 text-sm text-gray-600">
                        {video.kind == "youtube" && <BsYoutube className="mr-1 inline" />}
                        {video.authorName}
                      </p>
                      <p className="line-clamp-1 text-sm text-gray-600">
                        {displayDate(NaiveDate.parseUnsafe(video.publishedAt))}
                      </p>
                      <div className="space-x-1">
                        {video.presents.map((present) => (
                          <MemberIcon member={present} key={present} size={24} />
                        ))}
                      </div>
                    </div>
                    <div className="max-h-32 w-32 flex-none">
                      <img src={video.imageUrl} alt={video.title} className="object-contain" />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex items-center justify-center gap-6">
          {page == 1 ? (
            <div className="rounded border p-2 text-gray-300">
              <BsChevronLeft />
            </div>
          ) : (
            <Link
              className="text-nadeshiko-800 hover:bg-nadeshiko-200 border-nadeshiko-500 block rounded border p-2"
              to={`/media?p=${Math.max(1, page - 1)}`}
            >
              <BsChevronLeft />
            </Link>
          )}
          <div className="text-gray-600">
            {page} / {total}
          </div>
          {page == total ? (
            <div className="rounded border p-2 text-gray-300">
              <BsChevronRight />
            </div>
          ) : (
            <Link
              className="text-nadeshiko-800 hover:bg-nadeshiko-200 border-nadeshiko-500 block rounded border p-2"
              to={`/media?p=${Math.min(total, page + 1)}`}
            >
              <BsChevronRight />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
