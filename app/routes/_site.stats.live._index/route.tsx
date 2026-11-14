import { MetaFunction, useLoaderData } from "react-router";
import { cloudflareContext } from "~/cloudflare-context.ts";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles.ts";
import { LiveStatsData } from "~/features/live-stats/liveStatsData.ts";
import { buildLiveStatsSummary } from "~/features/live-stats/liveStatsSummary.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import type { Route } from "./+types/route.ts";
import { LiveStatsSummary } from "./LiveStatsSummary.tsx";
import { LiveTypeBreakdown } from "./LiveTypeBreakdown.tsx";
import { StageHistory } from "./StageHistory.tsx";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("ライブ統計") },
    {
      name: "description",
      content: "高嶺のなでしこのライブ開催実績と、年別・月別のステージ数の推移をまとめています。",
    },
  ];
};

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const url = new URL("/data/stats/lives.json", request.url).toString();
  const response = await context.get(cloudflareContext).env.ASSETS.fetch(url);
  if (!response.ok) {
    throw new Response("Live statistics are not found.", { status: 500 });
  }
  const json: unknown = await response.json();
  const result = LiveStatsData.safeParse(json);
  if (!result.success) {
    throw new Response("Invalid live statistics.", { status: 500 });
  }
  return { data: result.data };
};

export default function Component() {
  const { data } = useLoaderData<typeof loader>();
  const summary = buildLiveStatsSummary(data.monthly);

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>ライブ統計</h1>
        <section aria-labelledby="overview-heading" className="mt-8 space-y-5">
          <h2 id="overview-heading" className={sectionHeading()}>
            サマリー
          </h2>
          <LiveStatsSummary name="累計の概要" summary={summary} />
        </section>
        <section aria-labelledby="stage-history-heading" className="mt-12">
          <h2 id="stage-history-heading" className={sectionHeading("mb-4")}>
            イベント数・ステージ数の推移
          </h2>
          <StageHistory data={data} />
        </section>
        <section aria-labelledby="live-type-breakdown-heading" className="mt-12">
          <h2 id="live-type-breakdown-heading" className={sectionHeading("mb-4")}>
            出演イベントの種類別割合
          </h2>
          <LiveTypeBreakdown data={data} />
        </section>
      </section>
    </div>
  );
}
