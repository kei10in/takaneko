import { clsx } from "clsx";
import { FaCat } from "react-icons/fa6";
import { HiSparkles, HiUser } from "react-icons/hi2";
import { IconType } from "react-icons/lib";

interface IconChipProps {
  icon: IconType;
  text: string;
  backgroundColor: string;
  iconColor: string;
  textColor: string;
  large?: boolean;
}

interface MeetAndGreetChipProps {
  text: string;
  color?: string;
  backgroundColor?: string;
  large?: boolean;
}

export const IconChip: React.FC<IconChipProps> = (props: IconChipProps) => {
  const { icon: Icon, text, backgroundColor, iconColor, textColor, large = false } = props;

  const sizeClass = large ? "h-5 px-1.5 text-sm" : "h-4 px-1 text-xs";

  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-0.5 rounded-full",
        sizeClass,
        backgroundColor,
      )}
    >
      <Icon className={iconColor} />
      <span className={clsx("text-nowrap", textColor)}>{text}</span>
    </div>
  );
};

export const FirstPerformanceBadge: React.FC = () => {
  return (
    <IconChip
      icon={HiSparkles}
      text="初披露"
      backgroundColor="bg-zinc-100"
      iconColor="text-yellow-400"
      textColor="text-zinc-700"
    />
  );
};

interface CoverBadgeProps {
  originalArtist: string;
}

export const CoverBadge: React.FC<CoverBadgeProps> = ({ originalArtist }: CoverBadgeProps) => {
  return (
    <IconChip
      icon={HiUser}
      text={originalArtist}
      backgroundColor="bg-zinc-100"
      iconColor="text-zinc-500"
      textColor="text-zinc-500"
    />
  );
};

export const MeetAndGreetChip: React.FC<MeetAndGreetChipProps> = ({
  text,
  color = "text-zinc-600",
  backgroundColor = "bg-zinc-100",
  large,
}: MeetAndGreetChipProps) => {
  return (
    <IconChip
      icon={FaCat}
      text={text}
      backgroundColor={backgroundColor}
      iconColor={color}
      textColor={color}
      large={large}
    />
  );
};
