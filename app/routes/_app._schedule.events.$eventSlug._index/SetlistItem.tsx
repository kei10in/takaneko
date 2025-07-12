import { clsx } from "clsx";
import { BsChevronRight } from "react-icons/bs";
import { Link } from "react-router";
import { StagePart } from "~/features/events/setlist";
import { ALL_SONGS } from "~/features/songs/songs";

interface Props {
  part: StagePart;
}

export const SetlistItem: React.FC<Props> = ({ part }: Props) => {
  if (part.kind == "costume") {
    return null;
  }

  if (part.kind == "announce") {
    const text = part.name;
    const subtext = part.members.join("、");
    return <SimpleListItem text={text} subtext={subtext} />;
  }
  if (part.kind == "talk") {
    const text = "MC";
    const subtext = "";
    return <SimpleListItem text={text} subtext={subtext} />;
  }
  if (part.kind == "special") {
    const text = part.title ?? "企画";
    const subtext = part.costumeName || "衣装不明";
    return <SimpleListItem text={text} subtext={subtext} />;
  }
  if (part.kind == "encore") {
    const text = "アンコール";
    const subtext = "";
    return <SimpleListItem text={text} subtext={subtext} />;
  }

  const n = `${part.index + 1}`;
  const name = part.songTitle;
  const desc = part.costumeName || "衣装不明";
  const slug =
    part.kind == "song" ? ALL_SONGS.find((track) => track.name === name)?.slug : undefined;

  const component = (
    <div className={clsx("group flex items-center justify-stretch")}>
      <p className="w-11 flex-none px-3 text-right font-semibold text-gray-400">{n}</p>
      <div className="w-full min-w-0 flex-1 px-2 py-2">
        <p className={clsx("line-clamp-1")}>{name}</p>
        <p className="line-clamp-1 text-xs text-gray-400">{desc}</p>
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

  if (slug == undefined) {
    return <li>{component}</li>;
  } else {
    return (
      <li>
        <Link className="block" to={`/songs/${slug}`}>
          {component}
        </Link>
      </li>
    );
  }
};

interface SimpleListItemProps {
  text: string;
  subtext: string;
}

const SimpleListItem: React.FC<SimpleListItemProps> = ({ text, subtext }: SimpleListItemProps) => {
  return (
    <li>
      <div className={clsx("group pl-11")}>
        <div className="w-full min-w-0 flex-1 px-2 py-2">
          <p className={clsx("line-clamp-1")}>{text}</p>
          <p className="line-clamp-1 text-xs text-gray-400">{subtext}</p>
        </div>
      </div>
    </li>
  );
};
