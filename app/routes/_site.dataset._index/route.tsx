import { clsx } from "clsx";
import { BsDownload, BsFiletypeCsv, BsFiletypeJson } from "react-icons/bs";
import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { SITE_TITLE } from "~/constants";
import { formatDataSize } from "~/utils/dataSize";

export const meta: MetaFunction = () => {
  return [
    { title: `データ - ${SITE_TITLE}` },
    {
      name: "description",
      content:
        "高嶺のなでしこ (たかねこ) の過去のライブで披露した楽曲に関する情報をセットリストデータとしてダウンロードできます。予想や分析をしてみてください。",
    },
  ];
};

const TAKANEKO_DATA_FILES = [
  {
    format: "CSV",
    formatIcon: <BsFiletypeCsv />,
    tags: ["csv", "UTF-8"],
    filename: "setlists.csv",
    url: "/data/setlists.csv",
  },
  {
    format: "CSV",
    formatIcon: <BsFiletypeCsv />,
    tags: ["csv", "UTF-8 with BOM"],
    filename: "setlists_utf8-with-bom.csv",
    url: "/data/setlists_utf8-with-bom.csv",
  },
  {
    format: "JSON",
    formatIcon: <BsFiletypeJson />,
    tags: ["json"],
    filename: "setlists.json",
    url: "/data/setlists.json",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const origin = new URL(request.url).origin;

  const promises = TAKANEKO_DATA_FILES.map(async (file): Promise<[string, number][]> => {
    const url = new URL(file.url, origin);

    try {
      const response = await fetch(url, { method: "HEAD" });
      if (!response.ok) {
        return [];
      }
      const size = response.headers.get("Content-Length");
      if (size == null) {
        return [];
      }

      return [[file.url, Number(size)]];
    } catch (error) {
      return [];
    }
  });

  const result = await Promise.all(promises);
  const sizes: Record<string, number> = Object.fromEntries(result.flat());

  return { sizes };
};

export default function Index() {
  const { sizes } = useLoaderData<typeof loader>();

  const schema = [
    {
      fieldName: "section",
      type: "string",
      description: (
        <p>
          本編かアンコールか。
          <code className="inline rounded-sm bg-gray-100 px-1 font-mono">main</code> は本編。
          <code className="inline rounded-sm bg-gray-100 px-1 font-mono">encore</code>{" "}
          はアンコール。
        </p>
      ),
    },
    {
      fieldName: "order",
      type: "number",
      description: "セクション内での 1 から開始する披露順",
    },
    {
      fieldName: "song",
      type: "string",
      description: "楽曲名",
    },
    {
      fieldName: "costume",
      type: "string",
      description: "衣装名",
    },
    {
      fieldName: "date",
      type: "string",
      description: (
        <p>
          <code className="inline rounded-sm bg-gray-100 px-1 font-mono">YYYY-MM-DD</code>{" "}
          形式の開催日
        </p>
      ),
    },
    {
      fieldName: "event",
      type: "string",
      description: "イベント名",
    },
    {
      fieldName: "act",
      type: "string",
      description:
        "二部構成のコンサートの場合は第何部かやタイトル。サーキット ライブの場合は開場名。",
    },
    {
      fieldName: "region",
      type: "string",
      description: "地域名",
    },
    {
      fieldName: "location",
      type: "string",
      description: "会場名",
    },
  ];

  return (
    <div className="container mx-auto max-w-3xl">
      <section className="px-4 py-8">
        <h1 className="text-nadeshiko-800 my-2 text-5xl font-semibold lg:mt-12">データ セット</h1>
        <section className="mt-8">
          <h2 className="text-2xl text-gray-500">セットリスト ログ</h2>
          <div className="my-4 space-y-1 text-sm">
            <p>高嶺のなでしこが過去のライブで披露した楽曲の記録です。</p>
            <p>
              CSV ファイルについて、Windows で文字化けが発生する場合は{" "}
              <code className="rounded bg-gray-100 px-1">setlist_utf8-with-bom.csv</code>{" "}
              を試してください。
            </p>
            <p>列やフィールドの説明は次の表を参照してください。</p>

            <table className="my-3 border-gray-600 text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-200 px-2 py-1 font-semibold">列名</th>
                  <th className="border border-gray-200 px-2 py-1 font-semibold">型</th>
                  <th className="border border-gray-200 px-2 py-1 font-semibold">説明</th>
                </tr>
              </thead>
              <tbody>
                {schema.map((field, i) => (
                  <tr
                    key={field.fieldName}
                    className={clsx(i % 2 == 1 ? "bg-gray-100" : "bg-white")}
                  >
                    <td className="border border-gray-200 px-2 py-1">{field.fieldName}</td>
                    <td className="border border-gray-200 px-2 py-1">{field.type}</td>
                    <td className="border border-gray-200 px-2 py-1">{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-500">ダウンロード</h3>
            <ul className="mt-1 divide-y divide-gray-200 rounded-lg border border-gray-200">
              {TAKANEKO_DATA_FILES.map((item) => {
                const size = sizes[item.url];

                return (
                  <li key={item.url}>
                    <Link
                      to={item.url}
                      className="flex items-stretch"
                      download={item.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex-0 py-1 pl-2 text-gray-500">
                        <div className="px-1 py-2">{item.formatIcon}</div>
                      </div>
                      <div className="min-w-0 flex-1 py-2">
                        <p className="text-base">
                          <span className="font-mono">{item.filename}</span>
                        </p>
                        <ul className="mt-1 flex gap-1">
                          {item.tags.map((tag) => (
                            <li
                              key={tag}
                              className="inline-block rounded-full bg-gray-100 px-2 text-xs text-gray-600"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-none items-center justify-center text-sm text-gray-500">
                        {formatDataSize(size)}
                      </div>

                      <div className="flex flex-none items-center justify-center p-4">
                        <BsDownload className="text-nadeshiko-900" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </section>
    </div>
  );
}
