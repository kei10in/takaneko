import { clsx } from "clsx";
import { Fragment } from "react";
import { BsChevronRight } from "react-icons/bs";
import { Link } from "react-router";
import { StagePart } from "~/features/events/setlist";
import { ALL_SONGS } from "~/features/songs/songs";
import { LinkDescription } from "~/utils/types/LinkDescription";

interface Props {
  title?: string | undefined;
  setlist: StagePart[];
  links: LinkDescription[];
}

export const Setlist: React.FC<Props> = (props: Props) => {
  const { title, setlist, links } = props;

  return (
    <section className="">
      <h3 className="my-2 pb-1 text-lg leading-tight font-semibold text-gray-500">
        {title ?? "セットリスト"}
      </h3>

      <div className="pl-4">
        <ul className="divide-y divide-gray-100">
          {setlist.map((part, i) => {
            if (part.kind == "costume") {
              return null;
            }

            const { n, name, desc } =
              part.kind == "announce"
                ? { n: "", name: part.name, desc: part.members.join("、") }
                : part.kind == "talk"
                  ? { n: "", name: "MC", desc: undefined }
                  : part.kind == "song"
                    ? {
                        n: `${part.index + 1}`,
                        name: part.songTitle,
                        desc: part.costumeName || "衣装不明",
                      }
                    : part.kind == "encore"
                      ? { n: "", name: "アンコール", desc: undefined }
                      : { n: "", name: part.title || "企画", desc: part.costumeName || "衣装不明" };

            const slug =
              part.kind == "song"
                ? ALL_SONGS.find((track) => track.name === name)?.slug
                : undefined;

            const child = (
              <div className={clsx("group flex items-center gap-3")}>
                <p className="w-8 flex-none">
                  <p className="flex-1 text-right font-semibold text-gray-400">{n}</p>
                </p>
                <div className="min-w-0 flex-1 px-2 py-2">
                  <p className={clsx("line-clamp-1")}>{name}</p>
                  {desc && <p className="line-clamp-1 text-xs text-gray-400">{desc}</p>}
                </div>
                {slug && (
                  <div className="flex flex-none items-center justify-center px-1">
                    <div className="flex items-center rounded-full p-1.5 text-gray-500 group-hover:bg-gray-100">
                      <BsChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            );

            return (
              <li key={i}>
                {slug == undefined ? child : <Link to={`/songs/${slug}`}>{child} </Link>}
              </li>
            );
          })}
        </ul>
      </div>

      {links.length > 0 && (
        <p className="mt-4 pl-6 text-xs text-gray-400">
          出典:{" "}
          <Link
            className="text-nadeshiko-600"
            to={links[0].url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {links[0].text}
          </Link>
          {links.slice(1).map((link) => (
            <Fragment key={link.url}>
              <span>{" / "}</span>
              <Link
                className="text-nadeshiko-600"
                to={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.text}
              </Link>
            </Fragment>
          ))}
        </p>
      )}
    </section>
  );
};
