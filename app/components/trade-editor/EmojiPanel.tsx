import { Switch } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  selected?: string;
  onChange?: (emoji: string) => void;
}

export const SelectableEmojis = [
  "🐥",
  "🐬",
  "🍑",
  "🕊️",
  "🍀",
  "👶🏻",
  "🐣",
  "🏹",
  "🎀",
  "🛼",
  "💛",
  "🩵",
  "🩷",
  "🤍",
  "💚",
  "🧡",
  "💜",
  "❤️",
  "💖",
  "💙",
];

export const EmojiPanel: React.FC<Props> = (props: Props) => {
  const { selected, onChange } = props;

  return (
    <div className="p-4">
      <div className="grid grid-cols-5 gap-2">
        {SelectableEmojis.map((emoji) => (
          <Switch
            key={emoji}
            className={clsx(
              "group h-10 w-10 rounded-xl p-1 transition-colors data-[checked]:bg-gray-200",
              "text-2xl",
            )}
            checked={selected === emoji}
            onClick={() => onChange?.(emoji)}
          >
            {emoji}
          </Switch>
        ))}
      </div>
    </div>
  );
};
