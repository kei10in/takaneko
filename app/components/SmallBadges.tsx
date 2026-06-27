import { clsx } from "clsx";
import { FaCat, FaCrown, FaPenNib } from "react-icons/fa6";
import { GiBowTieRibbon, GiCompactDisc, GiMicrophone, GiPopcorn } from "react-icons/gi";
import {
  HiBeaker,
  HiBookOpen,
  HiCake,
  HiCurrencyYen,
  HiRadio,
  HiSparkles,
  HiTv,
  HiUser,
  HiUsers,
  HiVideoCamera,
} from "react-icons/hi2";
import { IoDiamond } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { LiveType, liveTypeColor, liveTypeLabel } from "~/features/events/EventType";

interface Props {
  large?: boolean;
}

interface WithTextProps extends Props {
  text: string;
}

export const FirstPerformanceBadge: React.FC = () => {
  return (
    <div className="flex h-4 items-center justify-center gap-0.5 rounded-full bg-zinc-100 px-1 text-xs">
      <HiSparkles className="text-yellow-400" />
      <span className="text-nowrap text-zinc-700">初披露</span>
    </div>
  );
};

interface CoverBadgeProps {
  originalArtist: string;
}

export const CoverBadge: React.FC<CoverBadgeProps> = ({ originalArtist }: CoverBadgeProps) => {
  return (
    <div className="flex h-4 items-center justify-center gap-0.5 rounded-full bg-zinc-100 px-1 text-xs">
      <HiUser className="text-zinc-500" />
      <span className="text-nowrap text-zinc-500">{originalArtist}</span>
    </div>
  );
};

interface LiveTypeBadgeProps extends Props {
  liveType: LiveType;
}

export const LiveTypeBadge: React.FC<LiveTypeBadgeProps> = ({
  liveType,
  large,
}: LiveTypeBadgeProps) => {
  if (liveType === LiveType.SOLO) {
    return <SoloConcertBadge large={large} />;
  }
  if (liveType === LiveType.HOSTED) {
    return <HostedJointLiveBadge large={large} />;
  }
  if (liveType == LiveType.FESTIVAL || liveType == LiveType.JOINT || liveType == LiveType.GUEST) {
    return <JointLiveBadge large={large} />;
  }
  if (liveType == LiveType.EVENT_LIVE) {
    return <EventLiveBadge large={large} />;
  }
  if (liveType == LiveType.RELEASE_EVENT) {
    return <ReleaseEventBadge large={large} />;
  }

  return (
    <div
      className={clsx(
        "flex items-center rounded-full px-2 text-xs text-white",
        liveTypeColor(liveType),
      )}
    >
      {liveTypeLabel(liveType)}
    </div>
  );
};

export const SoloConcertBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={FaCrown} text="ワンマン" color="nadeshiko" large={large} />;
};

export const HostedJointLiveBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={FaPenNib} text="主催対バン" color="light-blue" large={large} />;
};

export const JointLiveBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={HiUsers} text="対バン" color="amber" large={large} />;
};

export const EventLiveBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={IoDiamond} text="イベント出演" color="amber" large={large} />;
};

export const ReleaseEventBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={GiCompactDisc} text="リリースイベント" color="violet" large={large} />;
};

export const LiveBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={GiMicrophone} text="ライブ" color="nadeshiko" large={large} />;
};

export const MeetAndGreetBadge: React.FC<WithTextProps> = ({ text, large }: WithTextProps) => {
  return <Badge icon={FaCat} text={text} color="black" large={large} />;
};

export const StreamingBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={HiVideoCamera} text="配信" color="amber" large={large} />;
};

export const VarietyEventBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={GiPopcorn} text="バラエティ" color="purple" large={large} />;
};

export const FashionShowBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={GiBowTieRibbon} text="ファッションショー" color="nadeshiko" large={large} />;
};

export const TvAppearanceBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={HiTv} text="テレビ" color="light-blue" large={large} />;
};

export const RadioAppearanceBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={HiRadio} text="ラジオ" color="light-blue" large={large} />;
};

export const CdBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={GiCompactDisc} text="CD" color="fuchsia" large={large} />;
};

export const BookBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={HiBookOpen} text="書籍" color="indigo" large={large} />;
};

export const MagazineBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={HiBookOpen} text="雑誌" color="indigo" large={large} />;
};

export const BirthdayBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={HiCake} text="誕生日" color="amber" large={large} />;
};

export const SalesOpenBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={HiCurrencyYen} text="販売開始" color="gray" large={large} />;
};

export const OtherBadge: React.FC<WithTextProps> = ({ text, large }: WithTextProps) => {
  return <Badge icon={HiBeaker} text={text} color="dark-amber" large={large} />;
};

interface BadgeProps {
  icon: IconType;
  text: string;
  color:
    | "light-blue"
    | "nadeshiko"
    | "amber"
    | "fuchsia"
    | "indigo"
    | "violet"
    | "purple"
    | "black"
    | "gray"
    | "dark-amber";
  large?: boolean;
}

const Badge: React.FC<BadgeProps> = (props: BadgeProps) => {
  const { icon: Icon, text, color, large = false } = props;

  const BorderColorSet = {
    "light-blue": "border-blue-400",
    nadeshiko: "border-nadeshiko-800",
    amber: "border-amber-500",
    indigo: "border-indigo-400",
    fuchsia: "border-fuchsia-500",
    violet: "border-violet-400",
    purple: "border-purple-400",
    black: "border-zinc-600",
    gray: "border-gray-500",
    "dark-amber": "border-amber-700",
  } as const;

  const TextColorSet = {
    "light-blue": "text-blue-400",
    nadeshiko: "text-nadeshiko-800",
    amber: "text-amber-500",
    indigo: "text-indigo-400",
    fuchsia: "text-fuchsia-500",
    violet: "text-violet-400",
    purple: "text-purple-400",
    black: "text-zinc-600",
    gray: "text-gray-500",
    "dark-amber": "text-amber-700",
  } as const;

  const borderColor = BorderColorSet[color];
  const textColor = TextColorSet[color];

  const sizeClass = large ? "h-5 text-sm px-1.5" : "h-4 text-xs px-1";

  return (
    <div
      className={clsx(
        "box-border inline-flex items-center justify-center gap-0.5 rounded-full border bg-white",
        sizeClass,
        borderColor,
      )}
    >
      <Icon className={textColor} />
      <span className={clsx("text-nowrap", textColor)}>{text}</span>
    </div>
  );
};

interface TextBadgeProps {
  text: string;
}

export const TextBadge: React.FC<TextBadgeProps> = ({ text }: TextBadgeProps) => {
  return (
    <div className="flex h-4 items-center rounded-full bg-zinc-100 px-2 text-xs text-zinc-600">
      {text}
    </div>
  );
};
