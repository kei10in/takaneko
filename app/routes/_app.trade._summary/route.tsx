import { Tabs } from "@base-ui/react/tabs";
import { BsChevronLeft } from "react-icons/bs";
import { Link, Outlet, useLocation, useMatch, useNavigate, useSearchParams } from "react-router";
import { AllMembers } from "~/features/profile/members.ts";
import { MemberSelector } from "./MemberSelector.tsx";
import { TradeSummaryOutletContext } from "./useTradeSummaryOutletContext.ts";

const wishListPath = "/trade/wishlist";
const tradeListPath = "/trade/tradelist";

const tabs = [
  { path: wishListPath, label: "欲しいやつ" },
  { path: tradeListPath, label: "譲れるやつ" },
];

export default function TradeLists() {
  const activePath = useMatch(tradeListPath) ? tradeListPath : wishListPath;
  const { search } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const memberId = searchParams.get("m");
  const selectedMember = AllMembers.find((member) => member.id === memberId);
  const outletContext: TradeSummaryOutletContext = { selectedMember };

  return (
    <div className="mx-auto w-full max-w-lg pb-12 lg:max-w-5xl">
      <div className="px-4">
        <Link
          to="/trade"
          className="inline-flex min-h-8 items-center gap-1 text-base text-zinc-600 hover:underline"
        >
          <BsChevronLeft aria-hidden="true" />
          グッズ一覧
        </Link>
      </div>
      <section className="mt-12">
        <h1 className="page-heading px-4">まとめ</h1>
        <p className="page-description mt-1 px-4">
          トレード用画像を作ったついでにリストの確認やまとめ画像のダウンロードができます。
        </p>

        <Tabs.Root
          value={activePath}
          onValueChange={(pathname) => {
            void navigate({ pathname, search }, { preventScrollReset: true });
          }}
        >
          <div className="mt-2 flex items-center">
            <Tabs.List
              activateOnFocus
              aria-label="まとめ"
              className="hidden-scrollbar pill-tab-list min-w-0 flex-1 py-4"
            >
              {tabs.map(({ path, label }) => (
                <Tabs.Tab key={path} value={path} className="pill-tab">
                  <span className="pill-tab-label">{label}</span>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <div className="pr-4">
              <MemberSelector
                selectedMember={selectedMember}
                onSelect={(member) =>
                  setSearchParams(member == undefined ? undefined : { m: member.id }, {
                    preventScrollReset: true,
                  })
                }
              />
            </div>
          </div>
          {tabs.map(({ path }) => (
            <Tabs.Panel key={path} value={path} tabIndex={-1}>
              {path === activePath && <Outlet context={outletContext} />}
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      </section>
    </div>
  );
}
