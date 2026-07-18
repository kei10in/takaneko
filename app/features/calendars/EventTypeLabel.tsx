import { clsx } from "clsx";
import { FaCat } from "react-icons/fa6";
import { GiBowTieRibbon, GiCompactDisc, GiMicrophone, GiPopcorn } from "react-icons/gi";
import {
  HiBeaker,
  HiBookOpen,
  HiCake,
  HiCurrencyYen,
  HiRadio,
  HiTv,
  HiVideoCamera,
} from "react-icons/hi2";
import { IconType } from "react-icons/lib";
import { assertNever } from "~/utils/assertNever";
import { UiColors } from "~/utils/uiColors";
import { EventType, eventTypeColors } from "../events/EventType";

interface Props {
  category: EventType;
}

export const EventTypeLabel: React.FC<Props> = (props: Props) => {
  const { category } = props;
  const colors = eventTypeColors(category);

  switch (category) {
    case EventType.LIVE:
      return <IconLabel icon={GiMicrophone} text="ライブ" colors={colors} />;
    case EventType.MEET_AND_GREET:
      return <IconLabel icon={FaCat} text="対面イベント" colors={colors} />;
    case EventType.RELEASE_EVENT:
      return <IconLabel icon={GiCompactDisc} text="リリースイベント" colors={colors} />;
    case EventType.STREAMING:
      return <IconLabel icon={HiVideoCamera} text="配信" colors={colors} />;
    case EventType.VARIETY:
      return <IconLabel icon={GiPopcorn} text="バラエティ" colors={colors} />;
    case EventType.FASHION:
      return <IconLabel icon={GiBowTieRibbon} text="ファッション" colors={colors} />;
    case EventType.SALES_OPEN:
      return <IconLabel icon={HiCurrencyYen} text="販売開始" colors={colors} />;
    case EventType.CD:
      return <IconLabel icon={GiCompactDisc} text="CD" colors={colors} />;
    case EventType.BIRTHDAY:
      return <IconLabel icon={HiCake} text="誕生日" colors={colors} />;
    case EventType.TV:
      return <IconLabel icon={HiTv} text="テレビ" colors={colors} />;
    case EventType.RADIO:
      return <IconLabel icon={HiRadio} text="ラジオ" colors={colors} />;
    case EventType.ON_DEMAND:
      return <IconLabel icon={HiVideoCamera} text="オンデマンド" colors={colors} />;
    case EventType.BOOK:
      return <IconLabel icon={HiBookOpen} text="書籍" colors={colors} />;
    case EventType.MAGAZINE:
      return <IconLabel icon={HiBookOpen} text="雑誌" colors={colors} />;
    case EventType.OTHER:
      return <IconLabel icon={HiBeaker} text="その他" colors={colors} />;
    default:
      assertNever(category);
  }
};

interface IconLabelProps {
  icon: IconType;
  text: string;
  colors: UiColors;
}

const IconLabel: React.FC<IconLabelProps> = (props: IconLabelProps) => {
  const { icon: Icon, text, colors } = props;

  return (
    <div className={clsx("inline-flex items-center gap-1.5 bg-white", "h-5 text-sm", colors.text)}>
      <Icon className="text-base" />
      <span className="font-semibold text-nowrap">{text}</span>
    </div>
  );
};
