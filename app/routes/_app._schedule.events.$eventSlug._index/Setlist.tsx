import { Fragment } from "react";
import { Link } from "react-router";
import { StagePart } from "~/features/events/setlist";
import { LinkDescription } from "~/utils/types/LinkDescription";

interface Props {
  title?: string | undefined;
  setlist: StagePart[];
  links: LinkDescription[];
}

export const Setlist: React.FC<Props> = (props: Props) => {
  const { title, setlist, links } = props;

  return (
    <section className="m-6">
      {title && <h3 className="m-2 pb-1 text-lg leading-tight font-semibold">{title}</h3>}

      <ul className="">
        {setlist.map((part, i) => {
          if (part.kind == "costume") {
            return null;
          }

          const { n, name, desc } =
            part.kind == "talk"
              ? { n: "", name: "MC", desc: "" }
              : part.kind == "song"
                ? {
                    n: `${part.index + 1}.`,
                    name: part.songTitle,
                    desc: part.costumeName || "衣装不明",
                  }
                : part.kind == "encore"
                  ? { n: "", name: "アンコール", desc: "" }
                  : { n: "", name: part.title || "企画", desc: part.costumeName || "衣装不明" };

          return (
            <li key={i} className="">
              <div className="flex min-h-8 items-center gap-3">
                <div className="w-6 text-right font-semibold text-gray-400">{n}</div>
                <div className="p-1">
                  <div>{name}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {links.length > 0 && (
        <p className="mt-4 pl-4 text-xs text-gray-400">
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
