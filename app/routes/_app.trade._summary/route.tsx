import { Tabs } from "@base-ui/react/tabs";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router";
import { pageBox, pageHeading } from "~/components/styles.ts";

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

  return (
    <section className={pageBox("mx-auto w-full max-w-lg lg:max-w-3xl")}>
      <h1 className={pageHeading("px-4")}>サマリー</h1>
      <Tabs.Root
        value={activePath}
        onValueChange={(pathname) => {
          void navigate({ pathname, search }, { preventScrollReset: true });
        }}
      >
        <Tabs.List
          activateOnFocus
          aria-label="サマリー"
          className="hidden-scrollbar pill-tab-list mt-2 py-4"
        >
          {tabs.map(({ path, label }) => (
            <Tabs.Tab key={path} value={path} className="pill-tab">
              <span className="pill-tab-label">{label}</span>
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {tabs.map(({ path }) => (
          <Tabs.Panel key={path} value={path} tabIndex={-1}>
            {path === activePath && <Outlet />}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </section>
  );
}
