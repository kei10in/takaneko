import { HiOutlineInformationCircle } from "react-icons/hi2";
import { useLoaderData } from "react-router";
import { cloudflareContext } from "~/cloudflare-context.ts";
import { OgpSiteName } from "~/constants.ts";
import { LiveStatsData } from "~/features/live-stats/liveStatsData.ts";
import { buildLiveStatsSummary } from "~/features/live-stats/liveStatsSummary.ts";
import { canonicalUrl } from "~/metadata/canonicalUrl.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import type { Route } from "./+types/route.ts";
import { LiveStatsSummary } from "./LiveStatsSummary.tsx";
import { LiveTypeBreakdown } from "./LiveTypeBreakdown.tsx";
import { StageHistory } from "./StageHistory.tsx";

export const meta: Route.MetaFunction = ({ location }) => {
  const title = formatTitle("ライブ統計");
  const description =
    "高嶺のなでしこのライブ統計。累計のステージ数・イベント数・出演日数、活動年別・西暦別の推移、ワンマン・対バン・リリイベなどのイベントの種類別内訳を掲載しています。";
  const canonical = canonicalUrl(location.pathname);
  const image = canonicalUrl("/takanekono-card.png");

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:site_name", content: OgpSiteName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "ja_JP" },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@takanekofan" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
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
      <section className="page-box">
        <h1 className="page-heading px-4">ライブ統計</h1>
        <p className="page-description px-4 pt-2">
          高嶺のなでしこのライブ開催実績と、年別・月別のステージ数の推移をまとめています。
        </p>
        <section aria-labelledby="overview-heading" className="mt-8 space-y-5 px-4">
          <h2 id="overview-heading" className="section-heading">
            サマリー
          </h2>
          <LiveStatsSummary name="累計の概要" summary={summary} />
        </section>
        <section aria-labelledby="stage-history-heading" className="mt-12 px-4">
          <h2 id="stage-history-heading" className="section-heading mb-4">
            イベント数・ステージ数の推移
          </h2>
          <StageHistory data={data} />
        </section>
        <section aria-labelledby="live-type-breakdown-heading" className="mt-12 px-4">
          <h2 id="live-type-breakdown-heading" className="section-heading mb-4">
            出演イベントの種類別割合
          </h2>
          <LiveTypeBreakdown data={data} />
        </section>
        <section aria-labelledby="aggregation-method-heading" className="mt-18 px-4">
          <div
            aria-labelledby="aggregation-method-heading"
            className="rounded-3xl bg-zinc-50 px-6 py-8 text-zinc-900"
          >
            <h2
              id="aggregation-method-heading"
              className="section-heading mb-4 flex items-center gap-2"
            >
              <HiOutlineInformationCircle />
              集計方法について
            </h2>
            <p>イベント情報の更新によって集計結果が変わることがあります。</p>
            <p>
              開催されたイベントに限定して集計しています。
              中止されたイベントや辞退したイベントは集計には含まれません。
            </p>

            <dl className="mt-4 space-y-3">
              <dt className="font-semibold"> ステージ数</dt>
              <dd>
                出演したステージごとにカウントしています。
                同じのイベントで複数ステージに出演した場合や2部制のワンマンライブなどはそれぞれのステージを数えます。
              </dd>

              <dt className="font-semibold">イベント数</dt>
              <dd>
                ひとつのイベントの中で複数のステージに出演していたとしても 1
                イベントとしてカウントします。
                複数の日にわたるイベントは、それぞれにカウントしています。
              </dd>

              <dt className="font-semibold">ワンマン</dt>
              <dd>主催のワンマンライブ・ファンミーティングをカウントしています。</dd>
              <dt className="font-semibold">対バン</dt>
              <dd>
                対バンライブやフェス、主催対バンをカウントしています。
                「全国お招きツアー」のファイナル以外の公演や「たかねこフェス」も対バンとしてカウントしています。
                イベントの名称ではなく、実際の開催形態に基づいて分類しています。
              </dd>

              <dt className="font-semibold">リリイベ</dt>
              <dd>高嶺のなでしこの CD のリリースイベントをカウントしています。</dd>

              <dt className="font-semibold">その他</dt>
              <dd>
                ファッションショーでのライブステージや外部主催のワンマンライブ、学園祭などをカウントしています。
              </dd>
            </dl>
          </div>
        </section>
      </section>
    </div>
  );
}
