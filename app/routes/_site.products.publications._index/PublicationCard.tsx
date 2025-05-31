import { BsBook } from "react-icons/bs";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

interface Props {
  name: string;
  date: NaiveDate;
  image?: string;
  imageSet?: string;
}

export const PublicationCard: React.FC<Props> = (props: Props) => {
  const { name, date, image, imageSet } = props;

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="aspect-square w-full flex-0">
        {image == undefined && (
          <div className="h-full w-full bg-gray-100 p-20 text-gray-400">
            <BsBook className="h-full w-full" />
          </div>
        )}
        {image && (
          <img
            src={image}
            srcSet={imageSet}
            alt={name}
            className="h-full w-full object-contain object-center"
          />
        )}
      </div>
      <div className="space-y-1 bg-gray-50 px-4 py-2">
        <div className="border-nadeshiko-800 text-nadeshiko-800 w-fit border px-2 py-px text-sm leading-none">
          {displayDate(date)}
        </div>
        <p className="text-sm">{name}</p>
      </div>
    </div>
  );
};
