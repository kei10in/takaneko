import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { clsx } from "clsx";
import { useState } from "react";
import { BsCheck2, BsChevronDown } from "react-icons/bs";
import { MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { formatTitle } from "~/utils/htmlHeader";
import { ConcertPerformanceCount } from "./ConcertPeformanceCount";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("楽曲別パフォーマンス回数") },
    {
      name: "description",
      content:
        "高嶺のなでしこ (たかねこ) の楽曲がライブでパフォーマンスされた回数を集計し、グラフで公開。セットリストの分析や人気曲の傾向、ライブ統計データをチェックできます。",
    },
  ];
};

const Terms = [
  {
    value: "recent30",
    label: "直近 30 日",
  },
  {
    value: "recent60",
    label: "直近 60 日",
  },
  {
    value: "recent90",
    label: "直近 90 日",
  },
  {
    value: "recent120",
    label: "直近 120 日",
  },
  {
    value: "recent180",
    label: "直近 180 日",
  },
];

export default function Component() {
  const [term, setTerm] = useState(Terms[2].value);

  const label = Terms.find((t) => t.value === term)?.label ?? Terms[2].label;

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <div className="px-4 py-1">
        <Breadcrumb
          items={[
            { label: "たかねこの", to: "/" },
            { label: "統計", to: "/stats" },
          ]}
        />
      </div>

      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>楽曲別パフォーマンス回数</h1>

        <div className="mt-8 space-y-12">
          <section>
            <div className="mb-2 flex items-center">
              <h2 className={sectionHeading("flex-auto")}>最近のライブ</h2>
              <div className="flex-none">
                <Listbox value={term} onChange={setTerm}>
                  <ListboxButton className="flex w-36 items-center rounded-full border border-gray-300 px-2 py-0.5 text-start text-sm">
                    <div className="flex-auto px-2 text-gray-600">{label}</div>
                    <BsChevronDown className="flex-none text-gray-400" />
                  </ListboxButton>
                  <ListboxOptions
                    anchor={{ to: "bottom end", gap: 4, offset: -4 }}
                    className={clsx(
                      "focus-none w-34 rounded border border-gray-100 bg-white py-1 shadow",
                    )}
                  >
                    {Terms.map((term) => (
                      <ListboxOption
                        key={term.value}
                        value={term.value}
                        className={clsx(
                          "block w-full px-2.5 py-1 text-start text-sm text-gray-600",
                          "data-focus:bg-nadeshiko-200 data-focus:text-nadeshiko-900",
                        )}
                      >
                        {({ selected }) => {
                          return (
                            <div className="flex items-center select-none">
                              <div className="w-4">
                                {selected && (
                                  <BsCheck2 className="inline-block text-lg text-nadeshiko-900" />
                                )}
                              </div>
                              <div className="px-2">{term.label}</div>
                            </div>
                          );
                        }}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Listbox>
              </div>
            </div>

            <p className="mb-4 text-gray-600">
              直近のライブでパフォーマンスされた楽曲のトップ 20 曲を表示しています。
            </p>
            <ConcertPerformanceCount term={term} range={20} />
          </section>

          <section>
            <h2 className={sectionHeading("mb-2")}>すべてのライブ</h2>
            <p className="mb-4 text-gray-600">
              いくつかのライブのセットリストが不明なため、数値は一部不正確です。
            </p>
            <ConcertPerformanceCount term="all" />
          </section>

          <section>
            <h2 className={sectionHeading("mb-2")}>不明なセットリストについて</h2>

            <p className="mb-4 text-gray-600">現在下記のライブのセットリストが不明です。 </p>

            <ul className="my-2 list-disc pl-6 marker:text-gray-400">
              <li>
                <p>たかねこの秋まつり2024 〜FC limited〜 第一部</p>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
}
