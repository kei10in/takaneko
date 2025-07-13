import { clsx } from "clsx";
import { BsChevronRight, BsMusicNoteBeamed } from "react-icons/bs";
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
  if (part.kind == "overture") {
    const text = "Overture";
    const subtext = "";
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
  if (part.kind == "interlude") {
    const text = part.description ?? "幕間";
    const subtext = part.description != undefined ? "幕間" : "";
    return <SimpleListItem text={text} subtext={subtext} />;
  }
  if (part.kind == "encore") {
    const text = "アンコール";
    return <SectionListItem text={text} />;
  }

  const n = `${part.index + 1}`;
  const name = part.songTitle;
  const desc = part.costumeName || "衣装不明";
  const track = ALL_SONGS.find((track) => track.name === name);
  const slug = track?.slug;
  const img = track?.coverArt;

  const component = (
    <div className={clsx("group flex items-center justify-stretch gap-2")}>
      <p className="w-12 flex-none px-3 text-right font-semibold text-gray-400">{n}</p>
      <div className="flex-none py-2">
        <div className="flex items-center justify-center overflow-hidden rounded shadow">
          {img ? (
            <img className="h-10 w-10 object-cover" src={img} alt={name} />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center bg-gray-200">
              <BsMusicNoteBeamed className="h-5 w-5 flex-none bg-gray-200 text-gray-500" />
            </div>
          )}
        </div>
      </div>
      <div className="w-full min-w-0 flex-1 py-2">
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

interface SectionListItemProps {
  text: string;
}

const SectionListItem: React.FC<SectionListItemProps> = ({ text }: SectionListItemProps) => {
  return (
    <li>
      <div className="group flex h-14 items-end py-2 pl-2">
        <p className="line-clamp-1 font-semibold text-gray-600">{text}</p>
      </div>
    </li>
  );
};

interface SimpleListItemProps {
  text: string;
  subtext: string;
}

const SimpleListItem: React.FC<SimpleListItemProps> = ({ text, subtext }: SimpleListItemProps) => {
  return (
    <li>
      <div className={clsx("group pl-12")}>
        <div className="w-full min-w-0 flex-1 px-2 py-2">
          <p className={clsx("line-clamp-1")}>{text}</p>
          <p className="line-clamp-1 text-xs text-gray-400">{subtext}</p>
        </div>
      </div>
    </li>
  );
};
