import { Fragment } from "react";
import { Link } from "react-router";
import { StagePart } from "~/features/events/setlist";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { SetlistItem } from "./SetlistItem";

interface Props {
  setlist: StagePart[];
  links: LinkDescription[];
}

export const Setlist: React.FC<Props> = (props: Props) => {
  const { setlist, links } = props;

  return (
    <section>
      <h4 className="font-bold text-gray-500">セットリスト</h4>

      <ul className="mt-1 divide-y divide-gray-100 pb-4">
        {setlist.map((part, i) => {
          return <SetlistItem key={i} part={part} />;
        })}
      </ul>

      {links.length > 0 && (
        <p className="pb-4 pl-6 text-xs text-gray-400">
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
