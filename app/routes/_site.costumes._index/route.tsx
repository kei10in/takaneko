import { MetaFunction } from "react-router";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { AllMvCostumes } from "~/features/costumes/costumesMv";
import { AllSpecialCostumes } from "~/features/costumes/costumesSpecial";
import { AllStageCostumes } from "~/features/costumes/costumesStage";
import { AllTShirtCostumes } from "~/features/costumes/costumesTshirt";
import { Costume } from "~/features/costumes/types";
import { formatTitle } from "~/utils/htmlHeader";
import { CostumeCard } from "./CostumeCard";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`衣装`) },
    {
      name: "description",
      content: "高嶺のなでしこの衣装一覧",
    },
  ];
};

const COSTUME_CATEGORIES: { title: string; costumes: Costume[] }[] = [
  { title: "ステージ衣装", costumes: AllStageCostumes },
  { title: "MV / DPV 衣装", costumes: AllMvCostumes },
  { title: "T シャツ衣装", costumes: AllTShirtCostumes },
];

export default function Index() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox("space-y-8 px-4")}>
        <h1 className={pageHeading()}>衣装</h1>

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
