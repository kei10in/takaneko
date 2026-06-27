import { clsx } from "clsx";
import { FaCat, FaCrown, FaPenNib } from "react-icons/fa6";
import { GiCompactDisc, GiMicrophone } from "react-icons/gi";
import { HiSparkles, HiUser, HiUsers } from "react-icons/hi2";
import { IoDiamond } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { LiveType, liveTypeColor, liveTypeLabel } from "~/features/events/EventType";
import { UiColors } from "~/utils/uiColors";

interface BadgeProps {
  icon: IconType;
  text: string;
  colors: UiColors;
  large?: boolean;
}

const LightBlue = {
  text: "text-blue-400",
  background: "bg-blue-400",
  border: "border-blue-400",
} as UiColors;

const Nadeshiko = {
  text: "text-nadeshiko-800",
  background: "bg-nadeshiko-800",
  border: "border-nadeshiko-800",
} as UiColors;

const Black = {
  text: "text-zinc-600",
  background: "bg-zinc-600",
  border: "border-zinc-600",
} as UiColors;

const Amber = {
  text: "text-amber-500",
  background: "bg-amber-500",
  border: "border-amber-500",
} as UiColors;

const Violet = {
  text: "text-violet-400",
  background: "bg-violet-400",
  border: "border-violet-400",
} as UiColors;

const Badge: React.FC<BadgeProps> = (props: BadgeProps) => {
  const { icon: Icon, text, colors, large = false } = props;

  const borderColor = colors.border;
  const textColor = colors.text;

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

interface LiveTypeBadgeProps {
  liveType: LiveType;
  large?: boolean;
  colors?: UiColors;
}

export const LiveTypeBadge: React.FC<LiveTypeBadgeProps> = ({
  liveType,
  large,
  colors,
}: LiveTypeBadgeProps) => {
  if (liveType === LiveType.SOLO) {
    return <Badge icon={FaCrown} text="ワンマン" colors={colors ?? Nadeshiko} large={large} />;
  }
  if (liveType === LiveType.HOSTED) {
    return <Badge icon={FaPenNib} text="主催対バン" colors={colors ?? LightBlue} large={large} />;
  }
  if (liveType == LiveType.FESTIVAL || liveType == LiveType.JOINT || liveType == LiveType.GUEST) {
    return <Badge icon={HiUsers} text="対バン" colors={colors ?? Amber} large={large} />;
  }
  if (liveType == LiveType.EVENT_LIVE) {
    return <Badge icon={IoDiamond} text="イベント出演" colors={colors ?? Amber} large={large} />;
  }
  if (liveType == LiveType.RELEASE_EVENT) {
    return (
      <Badge icon={GiCompactDisc} text="リリースイベント" colors={colors ?? Violet} large={large} />
    );
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

interface LiveBadgeProps {
  large?: boolean;
  colors?: UiColors;
}

export const LiveBadge: React.FC<LiveBadgeProps> = ({ large, colors }: LiveBadgeProps) => {
  return <Badge icon={GiMicrophone} text="ライブ" colors={colors ?? Nadeshiko} large={large} />;
};

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

interface WithTextProps {
  text: string;
  large?: boolean;
}

export const MeetAndGreetBadge: React.FC<WithTextProps> = ({ text, large }: WithTextProps) => {
  return <Badge icon={FaCat} text={text} colors={Black} large={large} />;
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
