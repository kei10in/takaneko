import { Dialog, DialogPanel } from "@headlessui/react";
import { useMemo } from "react";
import {
  BsBoxArrowUpRight,
  BsCalendar,
  BsCalendar3,
  BsDoorOpen,
  BsLink45Deg,
  BsPersonFill,
  BsPersonFillSlash,
  BsPinMap,
} from "react-icons/bs";
import {
  Link,
  LoaderFunctionArgs,
  MetaDescriptor,
  MetaFunction,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import { ImageCarousel } from "~/components/ImageCarousel";
import { loadEventModule } from "~/features/events/events";
import { categoryToEmoji } from "~/features/events/EventType";
import { makeIcs } from "~/features/events/ical";
import { twitterCard } from "~/features/events/twitterCard";
import { displayDateWithDayOfWeek } from "~/utils/dateDisplay";
import { formatTitle } from "~/utils/htmlHeader";
import { findMemberDescription } from "../../features/profile/members";
import { EventDetails } from "./EventOverview";
import { EventRecap } from "./EventRecap";
import { makePageDescription } from "./makePageDescription";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const event = data == undefined ? undefined : loadEventModule(data.slug);
  const title = event?.meta.title ?? event?.meta.summary ?? "スケジュール";
  const description =
    event == undefined
      ? "高嶺のなでしこの非公式スケジュールです。"
      : (event.meta.description ?? makePageDescription(event.meta));

  const result: MetaDescriptor[] = [
    { title: formatTitle(title) },
    { name: "description", content: description },
  ];

  if (event != undefined) {
    result.push(...twitterCard(event.meta));
  }

  return result;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { eventSlug } = params;

  if (eventSlug == undefined) {
    throw new Response("", { status: 404 });
  }

  const event = loadEventModule(eventSlug);
  if (event == undefined) {
    throw new Response("", { status: 404 });
  }

  const ics = await makeIcs(eventSlug, event.meta);

  return { slug: eventSlug, ics };
};

export default function EventPage() {
  const data = useLoaderData<typeof loader>();
  const eventId = data.slug;
  const ics = data.ics;
  const event = useMemo(() => loadEventModule(eventId), [eventId]);

  const location = useLocation();
  const navigate = useNavigate();

  if (event == undefined) {
    return null;
  }

  const Content = event.Content;
  const meta = event.meta;
  const d = meta.date;

  const close = () => navigate(".", { replace: true, preventScrollReset: true });

  return (
    <div className="container mx-auto lg:max-w-4xl">
      <div>
        {meta.images.length > 0 && (
          <ImageCarousel
            images={meta.images.map((img, i) => ({
              src: img.path,
              alt: `アイキャッチ ${i + 1}`,
              to: `#photo-${i}`,
              replace: true,
              preventScrollReset: true,
            }))}
          />
        )}
        <div className="space-y-2 pb-4">
          <h1 className="px-4 pt-8 pb-1.5 text-2xl font-bold">
            <span>{categoryToEmoji(meta.category)}</span>
            <span>{meta.title ?? meta.summary}</span>
          </h1>
          <div className="flex items-center gap-1 px-5">
            <BsCalendar className="text-gray-400" />
            <p>
              {displayDateWithDayOfWeek(d)}
              {meta.start != undefined && ` ${meta.start} 〜`}
              {meta.end != undefined && ` ${meta.end}`}
            </p>
          </div>
          {meta.open && (
            <div className="flex items-center gap-1 px-5">
              <BsDoorOpen className="text-gray-400" />
              <p>開場 {meta.open} 〜</p>
            </div>
          )}
          {meta.location && (
            <Link
              className="block"
              to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meta.location)}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center gap-1 px-5">
                <span>
                  <BsPinMap className="text-gray-400" />
                </span>
                <span className="text-nadeshiko-900">{meta.location}</span>
                <span>
                  <BsBoxArrowUpRight className="text-gray-400" />
                </span>
              </div>
            </Link>
          )}

          {meta.link && (
            <Link className="block" to={meta.link.url} target="_blank" rel="noreferrer">
              <div className="flex items-center gap-1 px-5">
                <span>
                  <BsLink45Deg className="text-gray-400" />
                </span>
                <span className="text-nadeshiko-900">{meta.link.text}</span>
                <span>
                  <BsBoxArrowUpRight className="text-gray-400" />
                </span>
              </div>
            </Link>
          )}

          {meta.present != undefined && meta.present.length != 0 && (
            <div className="flex items-center gap-1 px-5">
              <span>
                <BsPersonFill className="text-gray-400" />
              </span>
              <span className="text-gray-600">
                {meta.present
                  .map((n) => {
                    if (n == "高嶺のなでしこ") {
                      return n;
                    }
                    return findMemberDescription(n).name;
                  })
                  .join(" / ")}
              </span>
            </div>
          )}

          {meta.absent != undefined && meta.absent.length != 0 && (
            <div className="flex items-center gap-1 px-5">
              <span>
                <BsPersonFillSlash className="text-gray-400" />
              </span>
              <span className="text-gray-600">
                {meta.absent.map((n) => findMemberDescription(n).name).join(" / ")}
              </span>
            </div>
          )}
        </div>
      </div>

      <article className="markdown mb-4 max-w-none px-4">
        <EventRecap recaps={meta.recaps} />

        <EventDetails
          ticket={meta.overview?.ticket}
          timeSlot={meta.overview?.timeSlot}
          timetable={meta.overview?.timetable}
          streaming={meta.overview?.streaming}
          goods={meta.overview?.goods}
        />

        <Content />

        {meta.links.length > 0 && (
          <section>
            <h2>リンク</h2>
            <ul>
              {meta.links.map((link, i) => (
                <li key={i}>
                  <Link to={link.url} target="_blank" rel="noreferrer">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {ics != undefined && (
        <Link
          className="border-nadeshiko-500 bg-nadeshiko-100 mx-auto my-10 block w-fit rounded-md border px-3 py-1"
          to={ics.dataUrl}
          download={ics.filename}
          discover="none"
        >
          <div className="text-nadeshiko-800 flex items-center gap-1">
            <span>
              <BsCalendar3 className="h-5 w-5" />
            </span>
            <span>カレンダーに登録</span>
          </div>
        </Link>
      )}

      {meta.images.map((img, i) => (
        <Dialog
          key={i}
          open={location.hash == `#photo-${i}`}
          className="relative z-50"
          onClose={close}
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 backdrop-blur-xs">
            <DialogPanel className="h-fit w-fit overflow-hidden" onClick={close}>
              <img
                alt="プレビュー"
                className="block h-full max-h-[80svh] w-full object-contain"
                src={img.path}
              />

              <p className="p-1 text-right text-xs font-semibold text-white/80">
                <Link
                  to={img.ref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  <span>画像の引用元</span>
                  <BsBoxArrowUpRight />
                </Link>
              </p>
            </DialogPanel>
          </div>
        </Dialog>
      ))}

      {meta.overview?.timetable != undefined && (
        <Dialog open={location.hash == `#timetable`} className="relative z-50" onClose={close}>
          <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 backdrop-blur-xs">
            <DialogPanel className="h-fit w-fit overflow-hidden" onClick={close}>
              <img
                alt="プレビュー"
                className="block h-full max-h-[80svh] w-full object-contain"
                src={meta.overview.timetable.path}
              />

              <p className="p-1 text-right text-xs font-semibold text-white/80">
                <Link
                  to={meta.overview.timetable.ref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  <span>画像の引用元</span>
                  <BsBoxArrowUpRight />
                </Link>
              </p>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
