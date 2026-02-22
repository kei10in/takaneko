import { clsx } from "clsx";
import {
  BsChevronRight,
  BsHourglassSplit,
  BsMagic,
  BsMegaphoneFill,
  BsMicFill,
  BsMusicNoteBeamed,
  BsSoundwave,
} from "react-icons/bs";
import { Link } from "react-router";
import { Segment } from "~/features/events/setlist";
import { ALL_SONGS } from "~/features/songs/songs";

interface Props {
  part: Segment;
}

export const SetlistItem: React.FC<Props> = ({ part }: Props) => {
  if (part.kind == "costume") {
    return null;
  }

  if (part.kind == "announce") {
    const text = part.name;
    const subtext = part.members.join("、");
    return <SimpleListItem icon="megaphone" text={text} subtext={subtext} />;
  }
  if (part.kind == "overture") {
    const text = "Overture";
    const subtext = "";
    return <SimpleListItem icon="sound" text={text} subtext={subtext} />;
  }
  if (part.kind == "talk") {
    const text = "MC";
    const subtext = "";
    return <SimpleListItem icon="mic" text={text} subtext={subtext} />;
  }
  if (part.kind == "special") {
    const text = part.title ?? "企画";
    const subtext = part.costumeName || "衣装不明";
    return <SimpleListItem icon="special" text={text} subtext={subtext} />;
  }
  if (part.kind == "interlude") {
    const text = part.description ?? "幕間";
    const subtext = part.description != undefined ? "幕間" : "";
    return <SimpleListItem icon="interlude" text={text} subtext={subtext} />;
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
            <img
              className="h-10 w-10 bg-gray-100 object-cover text-xs text-gray-500"
              src={img}
              alt={name}
            />
          ) : (
            <div
              className={clsx(
                "flex h-10 w-10 items-center justify-center",
                slug && "bg-nadeshiko-200 text-nadeshiko-600",
                !slug && "bg-gray-100 text-gray-500",
              )}
            >
              <BsMusicNoteBeamed className="h-5 w-5 flex-none" />
            </div>
          )}
        </div>
      </div>
      <div className="w-full min-w-0 flex-1 py-2">
        <p className={clsx("line-clamp-1", slug && "text-nadeshiko-900")}>{name}</p>
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
  icon?: "mic" | "megaphone" | "sound" | "special" | "interlude" | undefined;
  text: string;
  subtext: string;
}

const SimpleListItem: React.FC<SimpleListItemProps> = ({
  icon,
  text,
  subtext,
}: SimpleListItemProps) => {
  const iconMap = {
    mic: BsMicFill,
    megaphone: BsMegaphoneFill,
    sound: BsSoundwave,
    special: BsMagic,
    interlude: BsHourglassSplit,
  } as const;
  const Icon = icon ? iconMap[icon] : null;

  return (
    <li>
      <div className={clsx("group flex items-center justify-stretch gap-2")}>
        <div className="flex-none pl-14">
          <div className="flex items-center justify-center overflow-hidden">
            <div className={clsx("flex size-10 items-center justify-center px-3")}>
              {Icon && <Icon className="h-5 w-5 flex-none text-nadeshiko-300" />}
            </div>
          </div>
        </div>
        <div className="w-full min-w-0 flex-1 py-2">
          <p className={clsx("line-clamp-1 text-nadeshiko-700")}>{text}</p>
          <p className="line-clamp-1 text-xs text-gray-400">{subtext}</p>
        </div>
      </div>
    </li>
  );
};
