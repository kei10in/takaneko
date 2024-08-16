import { Dialog, DialogPanel } from "@headlessui/react";
import {
  unstable_defineClientLoader as defineClientLoader,
  Link,
  MetaFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import clsx from "clsx";
import { HiArrowTopRightOnSquare, HiCalendar, HiLink, HiMapPin } from "react-icons/hi2";
import { SITE_TITLE } from "~/constants";
import { EventContent, loadEventContent } from "~/features/events/events";
import { categoryToEmoji } from "~/features/events/EventType";

export const meta: MetaFunction = () => {
  return [
    { title: `スケジュール (β) - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこの非公式スケジュールです。",
    },
  ];
};

export const clientLoader = defineClientLoader(async ({ params }): Promise<EventContent> => {
  const { eventId } = params;

  if (eventId == undefined) {
    throw new Response("", { status: 404 });
  }

  const event = await loadEventContent(eventId);
  if (event == undefined) {
    throw new Response("", { status: 404 });
  }

  return event;
});

export default function EventPage() {
  const event = useLoaderData<typeof clientLoader>();
  const { meta, Content } = event;

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <div className="space-y-2">
        {meta.image && (
          <Link to="#photo" replace={true}>
            <div
              className="relative h-64 bg-cover bg-center"
              style={{
                backgroundImage: `url("${meta.image.path}")`,
              }}
            >
              <div className="absolute inset-0 bg-opacity-20 backdrop-blur-xl" />
              <img src={meta.image.path} alt="アイキャッチ" className="relative mx-auto h-full" />
            </div>
          </Link>
        )}
        <div className="mt-4 px-4 text-lg font-bold">
          <span>{categoryToEmoji(meta.category)}</span>
          <span>{meta.summary}</span>
        </div>
        <div className="flex items-center gap-1 px-5">
          <HiCalendar className="text-gray-400" />
          <p>{meta.date}</p>
        </div>
        {meta.location && (
          <Link
            to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meta.location)}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center gap-1 px-5">
              <HiMapPin className="text-gray-400" />
              <div>{meta.location}</div>
              <HiArrowTopRightOnSquare />
            </div>
          </Link>
        )}

        {meta.link && (
          <Link to={meta.link.url} target="_blank" rel="noreferrer">
            <div className="flex items-center gap-1 px-5">
              <span>
                <HiLink className="text-gray-400" />
              </span>
              <span>{meta.link.text}</span>
              <span>
                <HiArrowTopRightOnSquare />
              </span>
            </div>
          </Link>
        )}
      </div>
      <article
        className={clsx(
          "prose mt-4 px-4 py-4",
          "prose-h1:my-2 prose-h1:text-center prose-h1:text-lg",
          "prose-h2:my-2 prose-h2:text-lg",
          "prose-p:text-base",
          "prose-li:my-0 prose-li:text-base",
        )}
      >
        <Content />
      </article>
      {meta.image && (
        <p className="px-4 text-right text-xs text-gray-400">
          <Link
            to={meta.image?.ref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1"
          >
            <span>画像の引用元</span>
            <HiArrowTopRightOnSquare />
          </Link>
        </p>
      )}

      {meta.image && (
        <Dialog
          open={location.hash == "#photo"}
          className="relative z-50"
          onClose={() => navigate(".", { replace: true })}
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <DialogPanel
              className="h-fit w-fit overflow-hidden"
              onClick={() => navigate(".", { replace: true })}
            >
              <img
                alt="プレビュー"
                className="h-full max-h-[80svh] w-full object-contain"
                src={meta.image.path}
              />
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
