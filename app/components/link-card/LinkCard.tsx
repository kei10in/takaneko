import { Link } from "react-router";
import useSWR from "swr";
import { SocialCards, validateSocialCards } from "~/utils/ogp/metaData";

interface Props {
  to: string;
  large?: boolean;
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    const json = await res.json();
    return validateSocialCards(json);
  });

// URL からパスとドメイン部分だけ抽出する
const getDisplayUrl = (url: string) => {
  const u = new URL(url);
  return u.hostname;
};

export const LinkCard: React.FC<Props> = (props: Props) => {
  const { to, large = false } = props;
  const displayUrl = getDisplayUrl(to);

  const { data, error, isLoading } = useSWR(`/link-card?q=${encodeURIComponent(to)}`, fetcher);

  if (large) {
    return (
      <LargeLinkCard
        to={to}
        displayUrl={displayUrl}
        data={data}
        error={error}
        isLoading={isLoading}
      />
    );
  } else {
    return (
      <SmallLinkCard
        to={to}
        displayUrl={displayUrl}
        data={data}
        error={error}
        isLoading={isLoading}
      />
    );
  }
};

interface InnerProps {
  to: string;
  displayUrl: string;
  data: SocialCards | undefined;
  error: unknown | undefined;
  isLoading: boolean;
}

const SmallLinkCard: React.FC<InnerProps> = (props: InnerProps) => {
  const { to, displayUrl, data, error, isLoading } = props;

  if (error) return <div>failed to load</div>;
  if (isLoading) {
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
  }
  if (data?.ogp == undefined) return <div>no data</div>;

  return (
    <Link className="inline-block" to={to}>
      <div className="h-28 shadow-sm">
        <div className="flex h-full">
          <div className="aspect-square h-full flex-none">
            <img
              className="h-full w-full object-cover object-center"
              src={data.ogp.image}
              alt="ogp"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center space-y-1 p-2">
            <p className="line-clamp-1 flex-none text-xs text-gray-400">{displayUrl}</p>
            <p className="line-clamp-1 flex-none text-sm font-bold text-gray-600">
              {data.ogp.title}
            </p>
            <p className="line-clamp-2 h-[2rem] text-xs text-gray-400">{data.ogp.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const LargeLinkCard: React.FC<InnerProps> = (props: InnerProps) => {
  const { to, displayUrl, data, error, isLoading } = props;

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  if (data?.ogp == undefined) return <div>no data</div>;

  return (
    <Link className="inline-block" to={to}>
      <div className="overflow-hidden shadow-sm">
        <div className="flex flex-col">
          <div className="flex-none">
            <img className="object-cover" src={data.ogp.image} alt="ogp" />
          </div>
          <div className="flex h-20 flex-none flex-col justify-center space-y-1 overflow-hidden text-ellipsis p-2">
            <p className="line-clamp-1 flex-none text-xs text-gray-400">{displayUrl}</p>
            <p className="line-clamp-2 flex-none text-sm font-bold text-gray-600">
              {data.ogp.title}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
