import { Fragment } from "react";
import { Link } from "react-router";
import { StagePart } from "~/features/events/setlist";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { SetlistItem } from "./SetlistItem";

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

      <div>
        <ul className="divide-y divide-gray-100">
          {setlist.map((part, i) => {
            return <SetlistItem key={i} part={part} />;
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
