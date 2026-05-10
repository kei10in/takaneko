import { BsExclamationTriangleFill } from "react-icons/bs";
import { MetaFunction } from "react-router";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import { AllMvCostumes } from "~/features/costumes/costumesMv";
import { AllSpecialCostumes } from "~/features/costumes/costumesSpecial";
import { AllStageCostumes } from "~/features/costumes/costumesStage";
import { AllTShirtCostumes } from "~/features/costumes/costumesTshirt";
import { AllUniformCostumes } from "~/features/costumes/costumesUniform";
import { Costume } from "~/features/costumes/types";
import { CostumeCard } from "./CostumeCard";

export const meta: MetaFunction = () => {
  return [
    { title: `衣装 - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこの衣装一覧",
    },
  ];
};

const COSTUME_CATEGORIES: { title: string; costumes: Costume[] }[] = [
  { title: "ステージ衣装", costumes: AllStageCostumes },
  { title: "制服衣装", costumes: AllUniformCostumes },
  { title: "MV / DPV 衣装", costumes: AllMvCostumes },
  { title: "T シャツ衣装", costumes: AllTShirtCostumes },
];

export default function Index() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox("space-y-8 px-4")}>
        <h1 className={pageHeading()}>衣装</h1>

        <div className="space-y-1 rounded-lg border border-amber-400 bg-amber-50 px-4 py-2">
          <p>
            <BsExclamationTriangleFill className="inline text-amber-400" />
            <span className="ml-2">工事中</span>
          </p>
          <p>このページは作成中です。</p>
        </div>

        {COSTUME_CATEGORIES.map((category) => (
          <section className="mt-8" key={category.title}>
            <h2 className={sectionHeading()}>{category.title}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {category.costumes.map((costume) => (
                <li key={costume.name}>
                  <CostumeCard costume={costume} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-8 space-y-4">
          <h2 className={sectionHeading()}>スペシャル衣装</h2>
          <p>
            スペシャル衣装は、ステージ衣装や制服衣装、MV 衣装、T
            シャツ衣装などのカテゴリに分類されない衣装です。
            イベントやコラボレーションなどで着用された衣装が含まれます。 高嶺のなでしこでない T
            シャツはスペシャル衣装に分類しています。
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {AllSpecialCostumes.map((costume) => (
              <li key={costume.name}>
                <CostumeCard costume={costume} />
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}
