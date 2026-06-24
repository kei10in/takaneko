import { clsx } from "clsx";
import {
  BsChevronRight,
  BsHourglassSplit,
  BsMagic,
  BsMegaphoneFill,
  BsMicFill,
  BsSoundwave,
} from "react-icons/bs";
import { HiMusicalNote, HiSparkles, HiUsers } from "react-icons/hi2";
import { Link } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { Segment } from "~/features/events/setlist";
import { memberNameToEmoji } from "~/features/profile/memberNameToEmoji";
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
  const members = part.members?.map((m) => memberNameToEmoji(m)).join("") ?? "";
  const costume = part.costumeName || "衣装不明";
  const track = ALL_SONGS.find((track) => track.name === name);
  const slug = track?.slug;
  const img = track?.coverArt;

  const component = (
    <div className={clsx("group flex items-stretch gap-4")}>
      <p className="flex w-7 flex-none items-center text-right text-lg font-semibold text-zinc-500">
        <span className="flex-1">{n}</span>
      </p>
      <div className="flex-none py-2">
        <div className="relative flex items-center justify-center overflow-hidden rounded-lg shadow">
          {img ? (
            <img
              className="size-15 bg-gray-100 object-cover text-xs text-zinc-500"
              src={img}
              alt={name}
            />
          ) : (
            <div
              className={clsx(
                "flex size-15 items-center justify-center",
                slug && "bg-nadeshiko-200 text-nadeshiko-600",
                !slug && "bg-zinc-100 text-zinc-500",
              )}
            >
              <HiMusicalNote className="size-[40%] flex-none" />
            </div>
          )}
          {part.isCover && (
            <Fragment>
              <div className="absolute top-0 left-0 rounded-br-lg bg-zinc-500 px-1 text-xs text-white">
                Cover
              </div>
            </Fragment>
          )}
        </div>
      </div>
      <div className="w-full min-w-0 flex-1 space-y-1 self-center">
        <p className={clsx("line-clamp-1", slug && "leading-none text-nadeshiko-900")}>{name}</p>
        <p className="line-clamp-1 text-xs text-zinc-500">{costume}</p>
        <div className="flex items-center gap-2">
          {part.isFirstTime && (
            <div className="flex items-center justify-center gap-0.5 rounded-full bg-nadeshiko-800 px-1 text-xs text-white">
              <HiSparkles />
              <span className="text-nowrap">初披露</span>
            </div>
          )}
          {part.isCover && part.originalArtist && (
            <div className="flex items-center justify-center gap-0.5 rounded-full bg-zinc-500 px-1.5 text-xs text-white">
              <HiUsers />
              <span className="text-nowrap">{part.originalArtist}</span>
            </div>
          )}
          {members != "" && <div className="text-xs text-nowrap">{members}</div>}
        </div>
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
  }

  return (
    <li>
      <Link className="block" to={`/songs/${slug}`}>
        {component}
      </Link>
    </li>
  );
};

interface SectionListItemProps {
  text: string;
}

const SectionListItem: React.FC<SectionListItemProps> = ({ text }: SectionListItemProps) => {
  return (
    <li>
      <div className="group flex h-14 items-end py-2">
        <p className="line-clamp-1 font-semibold">{text}</p>
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
      <div className={clsx("group flex items-center justify-stretch gap-4 pl-12")}>
        <div className="flex-none">
          <div className="flex items-center justify-center overflow-hidden">
            <div className={clsx("flex h-13 w-15 items-center justify-center px-3")}>
              {Icon && <Icon className="h-5 w-5 flex-none text-nadeshiko-500" />}
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
