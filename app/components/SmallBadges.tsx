import { clsx } from "clsx";
import { FaCrown, FaPenNib } from "react-icons/fa6";
import { GiCompactDisc, GiMicrophone } from "react-icons/gi";
import { HiRadio, HiSparkles, HiTv, HiUser, HiUsers } from "react-icons/hi2";
import { IoDiamond } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { LiveType, liveTypeColor, liveTypeLabel } from "~/features/events/EventType";

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

interface LiveTypeBadgeProps {
  liveType: LiveType;
}

export const LiveTypeBadge: React.FC<LiveTypeBadgeProps> = ({ liveType }: LiveTypeBadgeProps) => {
  if (liveType === LiveType.SOLO) {
    return <SoloConcertBadge />;
  }
  if (liveType === LiveType.HOSTED) {
    return <HostedJointLiveBadge />;
  }
  if (liveType == LiveType.FESTIVAL || liveType == LiveType.JOINT || liveType == LiveType.GUEST) {
    return <JointLiveBadge />;
  }
  if (liveType == LiveType.EVENT_LIVE) {
    return <EventLiveBadge />;
  }
  if (liveType == LiveType.RELEASE_EVENT) {
    return <ReleaseEventBadge />;
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

export const SoloConcertBadge: React.FC = () => {
  return (
    <div className="box-border flex h-4 items-center justify-center gap-0.5 rounded-full border border-nadeshiko-800 bg-white px-1 text-xs">
      <FaCrown className="text-nadeshiko-800" />
      <span className="text-nowrap text-nadeshiko-800">ワンマン</span>
    </div>
  );
};

export const HostedJointLiveBadge: React.FC = () => {
  return (
    <div className="box-border flex h-4 items-center justify-center gap-0.5 rounded-full border border-blue-400 bg-white px-1 text-xs">
      <FaPenNib className="text-blue-400" />
      <span className="text-nowrap text-blue-400">主催対バン</span>
    </div>
  );
};

export const JointLiveBadge: React.FC = () => {
  return (
    <div className="box-border flex h-4 items-center justify-center gap-0.5 rounded-full border border-amber-500 bg-white px-1 text-xs">
      <HiUsers className="text-amber-500" />
      <span className="text-nowrap text-amber-500">対バン</span>
    </div>
  );
};

export const EventLiveBadge: React.FC = () => {
  return (
    <div className="box-border flex h-4 items-center justify-center gap-0.5 rounded-full border border-amber-500 bg-white px-1 text-xs">
      <IoDiamond className="text-amber-500" />
      <span className="text-nowrap text-amber-500">イベント出演</span>
    </div>
  );
};

export const ReleaseEventBadge: React.FC = () => {
  return (
    <div className="box-border flex h-4 items-center justify-center gap-0.5 rounded-full border border-violet-400 bg-white px-1 text-xs">
      <GiCompactDisc className="text-violet-400" />
      <span className="text-nowrap text-violet-400">リリースイベント</span>
    </div>
  );
};

interface Props {
  large?: boolean;
}

export const LiveBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={GiMicrophone} text="ライブ" color="nadeshiko" large={large} />;
};

export const TvAppearanceBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={HiTv} text="テレビ" color="light-blue" large={large} />;
};

export const RadioAppearanceBadge: React.FC<Props> = ({ large }: Props) => {
  return <Badge icon={HiRadio} text="ラジオ" color="light-blue" large={large} />;
};

interface BadgeProps {
  icon: IconType;
  text: string;
  color: "light-blue" | "nadeshiko";
  large?: boolean;
}

const Badge: React.FC<BadgeProps> = (props: BadgeProps) => {
  const { icon: Icon, text, color, large = false } = props;

  const borderColor = color === "light-blue" ? "border-blue-400" : "border-nadeshiko-800";
  const textColor = color === "light-blue" ? "text-blue-400" : "text-nadeshiko-800";

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
