import { Link } from "react-router";

interface Props {
  to: string;
  displayUrl: string;
  title: string;
  description: string;
  image: string;
}

export const SmallLinkCard: React.FC<Props> = (props: Props) => {
  const { to, displayUrl, title, description, image } = props;

  return (
    <Link className="inline-block" to={to}>
      <div className="h-28 shadow-sm">
        <div className="flex h-full">
          <div className="aspect-square h-full flex-none">
            <img className="h-full w-full object-cover object-center" src={image} alt="ogp" />
          </div>
          <div className="flex flex-1 flex-col justify-center space-y-1 p-2">
            <p className="line-clamp-1 flex-none text-xs text-gray-400">{displayUrl}</p>
            <p className="flex-none text-sm font-bold text-gray-600">{title}</p>
            <p className="line-clamp-2 h-[2rem] text-xs text-gray-400">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const LoadingSmallLinkCard = () => {
  return (
    <div className="flex h-28 bg-white p-4 shadow-sm">
      <div className="aspect-square h-20 flex-none">
        <div className="h-full flex-none animate-pulse rounded-sm bg-gray-200" />
      </div>
      <div className="my-auto h-fit flex-1 space-y-4 p-4">
        <div className="h-2 w-24 animate-pulse rounded-sm bg-gray-200"></div>
        <div className="h-2 w-full animate-pulse rounded-sm bg-gray-200"></div>
        <div className="h-2 w-52 animate-pulse rounded-sm bg-gray-200"></div>
      </div>
    </div>
  );
};
