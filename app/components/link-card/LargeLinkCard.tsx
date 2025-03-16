import { Link } from "react-router";

interface Props {
  to: string;
  displayUrl: string;
  title: string;
  description: string;
  image: string;
}

export const LargeLinkCard: React.FC<Props> = (props: Props) => {
  const { to, displayUrl, title, image } = props;

  return (
    <Link className="inline-block" to={to}>
      <div className="overflow-hidden shadow-sm">
        <div className="flex flex-col">
          <div className="flex-none">
            <img className="object-cover" src={image} alt="ogp" />
          </div>
          <div className="flex h-20 flex-none flex-col justify-center space-y-1 overflow-hidden p-2 text-ellipsis">
            <p className="line-clamp-1 flex-none text-xs text-gray-400">{displayUrl}</p>
            <p className="line-clamp-2 flex-none text-sm font-bold text-gray-600">{title}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const LoadingLargeLinkCard = () => {
  return <div>loading...</div>;
};
