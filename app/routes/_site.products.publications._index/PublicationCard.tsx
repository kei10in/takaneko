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
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            <BsBook className="h-1/3 w-1/3" />
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
        <div className="w-fit border border-nadeshiko-800 px-2 py-px text-sm leading-none text-nadeshiko-800">
          {displayDate(date)}
        </div>
        <p className="text-sm">{name}</p>
      </div>
    </div>
  );
};
