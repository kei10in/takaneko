import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

interface Props {
  name: string;
  date: NaiveDate;
  image: string;
}

export const PublicationCard: React.FC<Props> = (props: Props) => {
  const { name, date, image } = props;

  return (
    <div className="w-full bg-white shadow">
      <div className="flex-0 aspect-square w-full">
        <img src={image} alt={name} className="h-full w-full object-contain object-center" />
      </div>
      <div className="space-y-1 bg-gray-50 px-4 py-2">
        <div className="w-fit border border-nadeshiko-800 px-2 py-px text-sm leading-none text-nadeshiko-800">
          {displayDate(date)}
        </div>
        <p className="text-sm">{name}</p>
      </div>
    </div>
  );
};
