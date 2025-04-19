import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import {
  BsCheck,
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsFillCameraReelsFill,
  BsMicFill,
  BsNewspaper,
  BsYoutube,
} from "react-icons/bs";
import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { MemberIcon } from "~/components/MemberIcon";
import { getAllMedia } from "~/features/media/allMedia";
import { MediaDetails } from "~/features/media/types";
import { AllMembers, findMemberDescription } from "~/features/profile/members";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { findFirstNonEmpty } from "~/utils/findFirstNonEmpty";
import { formatTitle } from "~/utils/htmlHeader";
import { ogp } from "~/utils/ogp/ogp";
import { validateYouTubeOEmbedResponse } from "~/utils/youtube/youtubeOEmbed";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("メディア") },
    {
      name: "description",
      content:
        "高嶺のなでしこ (たかねこ) メンバー、 " +
        "涼海すう / 城月菜央 / 橋本桃呼 / 葉月紗蘭 / 春野莉々 / 東山恵里沙 / 日向端ひな / 星谷美来 / 松本ももな / 籾山ひめり、" +
        "が出演しているメディア、YouTube やウェブ記事を一覧にしました。",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const m = url.searchParams.get("m");
  const selectedMember = AllMembers.find((member) => member.slug == m || member.id == m)?.id;
  const ps = url.searchParams.get("p");
  const pp = Number.parseInt(ps ?? "1", 10);
  // ページネーションは 1 から始まるので、pp - 1 にしています。
  const p = Number.isNaN(pp) ? 0 : pp - 1;

  // Cloudflare Workers ではサブリクエストの上限があるため、ページネーションが必要
  // サブリクエストの上限はフリープランでは 50 リクエストになっているが、
  // どこかにひとつ見えていないリクエストがあるため 50 では失敗する。
  const PAGE_SIZE = 40;

  const oEmbedEndpoint = "https://www.youtube.com/oembed";

  const allMedia = getAllMedia().filter((media) => {
    if (media.presents.length == 0) {
      return true;
    }

    if (selectedMember) {
      return media.presents.includes(selectedMember);
    }

    return true;
  });
  const total = Math.ceil(allMedia.length / PAGE_SIZE);
  const page = Math.max(0, Math.min(total, p));

  const metadataPromises = allMedia
    .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    .map(async (media): Promise<MediaDetails[]> => {
      if (media.kind == "static") {
        return [
          {
            kind: "static",
            title: media.title,
            authorName: media.authorName,
            publishedAt: media.publishedAt,
            mediaUrl: media.mediaUrl,
            imageUrl: media.image.path,
            category: media.category,
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
            category: media.category,
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

        return [
          {
            kind: "youtube",
            title: data.title,
            authorName: data.author_name,
            publishedAt: media.publishedAt,
            mediaUrl: `https://youtu.be/${media.videoId}`,
            imageUrl: data.thumbnail_url,
            category: "youtube",
            presents: media.presents,
          },
        ];
      } else {
        return [];
      }
    });

  const items = (await Promise.all(metadataPromises)).flatMap((x) => x);
  return { page: page + 1, total, items, selected: selectedMember };
};

export default function MediaIndex() {
  const metadata = useLoaderData<typeof loader>();
  const { page, total, items, selected } = metadata;

  return (
    <div className="container mx-auto max-w-3xl">
      <section className="p-4">
        <h1 className="text-nadeshiko-800 my-4 text-5xl font-semibold lg:mt-12">メディア</h1>

        <div className="my-4 flex justify-end">
          <Popover className="">
            <PopoverButton className="flex w-full items-center justify-between text-sm text-gray-600">
              {/* <div className="mx-auto flex-1 pl-2">メンバー</div> */}

              <div className="flex items-center gap-2">
                <MemberIcon member={selected ?? "高嶺のなでしこ"} size={24} />
                <p>{selected ? findMemberDescription(selected).name : "全員"}</p>
              </div>

              <div className="flex-none px-1">
                <BsChevronDown className="text-xs" />
              </div>
            </PopoverButton>
            <PopoverPanel
              anchor={{ to: "bottom end", gap: "0.5rem" }}
              className="border-nadeshiko-100 bg-nadeshiko-50 overflow-hidden rounded-sm border py-2 shadow-md"
            >
              {({ close }) => (
                <ul className="min-w-60">
                  <li>
                    <Link to="" className="block" onClick={() => close()}>
                      <div
                        className={clsx(
                          "flex items-center gap-2",
                          "hover:bg-nadeshiko-300 w-full px-6 py-1 text-base text-gray-600",
                          "data-current:bg-nadeshiko-700 data-current:text-white",
                        )}
                      >
                        <div className="text-nadeshiko-800 h-6 w-6">
                          {AllMembers.every((x) => x.id != selected) ? (
                            <BsCheck className="h-full w-full" />
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <MemberIcon member="高嶺のなでしこ" size={24} />
                          <p>全員</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  {AllMembers.map((c) => (
                    <li key={c.id}>
                      <Link to={`?m=${c.slug}`} onClick={() => close()}>
                        <div
                          className={clsx(
                            "flex items-center gap-2",
                            "hover:bg-nadeshiko-300 w-full px-6 py-1 text-base text-gray-600",
                            "data-current:bg-nadeshiko-700 data-current:text-white",
                          )}
                        >
                          <div className="text-nadeshiko-800 h-6 w-6">
                            {c.id == selected ? <BsCheck className="h-full w-full" /> : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <MemberIcon member={c.id} key={c.id} size={24} />
                            <p>{c.name}</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </PopoverPanel>
          </Popover>
        </div>

        <ul className="w-full space-y-6 py-2">
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
                        {video.category == "youtube" && <BsYoutube className="mr-1 inline" />}
                        {video.category == "video" && (
                          <BsFillCameraReelsFill className="mr-1 inline" />
                        )}
                        {video.category == "article" && <BsNewspaper className="mr-1 inline" />}
                        {video.category == "audio" && <BsMicFill className="mr-1 inline" />}
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
                    <div className="w-32 flex-none">
                      <img
                        src={video.imageUrl}
                        alt={video.title}
                        className="max-h-32 w-32 object-cover"
                      />
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
