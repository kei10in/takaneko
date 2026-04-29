import { GiAmpleDress } from "react-icons/gi";
import { Link } from "react-router";
import { Costume } from "~/features/costumes/types";

interface Props {
  costume: Costume;
}

export const CostumeCard: React.FC<Props> = (props: Props) => {
  const { costume } = props;
  const image = costume.images?.[0]?.path;

  return (
    <Link className="block h-full overflow-hidden" to={`./${costume.slug}`}>
      <div className="aspect-4/3 w-full bg-gray-50 rounded-lg transition shadow-sm hover:shadow-md overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={costume.name}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full  w-full items-center justify-center bg-gray-100">
            <GiAmpleDress className="h-12 w-12 text-gray-300" />
          </div>

          // <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-gray-400">
          //   <PiDress />
          // </div>
        )}
      </div>
      <div className="my-2">
        <p className="line-clamp-2 text-sm text-gray-700">{costume.name}</p>
      </div>
    </Link>
  );
};
