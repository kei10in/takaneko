import { MetaFunction } from "react-router";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import { AllMvCostumes } from "~/features/costumes/costumesMv";
import { AllSpecialCostumes } from "~/features/costumes/costumesSpecial";
import { AllStageCostumes } from "~/features/costumes/costumesStage";
import { AllTShirtCostumes } from "~/features/costumes/costumesTshirt";
import { AllUniformCostumes } from "~/features/costumes/costumesUniform";

export const meta: MetaFunction = () => {
  return [
    { title: `衣装 - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこの衣装一覧",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox()}>
        <h1 className={pageHeading()}>衣装</h1>

        <section className="mt-8">
          <h2 className={sectionHeading()}>ステージ衣装</h2>
          <ul className="mt-4 space-y-2">
            {AllStageCostumes.map((costume) => (
              <li key={costume.name}>{costume.name}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className={sectionHeading()}>制服衣装</h2>
          <ul className="mt-4 space-y-2">
            {AllUniformCostumes.map((costume) => (
              <li key={costume.name}>{costume.name}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className={sectionHeading()}>MV 衣装</h2>
          <ul className="mt-4 space-y-2">
            {AllMvCostumes.map((costume) => (
              <li key={costume.name}>{costume.name}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className={sectionHeading()}>T シャツ衣装</h2>
          <ul className="mt-4 space-y-2">
            {AllTShirtCostumes.map((costume) => (
              <li key={costume.name}>{costume.name}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className={sectionHeading()}>スペシャル衣装</h2>
          <p>
            スペシャル衣装は、ステージ衣装や制服衣装、MV 衣装、T
            シャツ衣装などのカテゴリに分類されない衣装です。
            イベントやコラボレーションなどで着用された衣装が含まれます。 高嶺のなでしこでない T
            シャツはスペシャル衣装に分類しています。
          </p>
          <ul className="space-y-2">
            {AllSpecialCostumes.map((costume) => (
              <li key={costume.name}>{costume.name}</li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}
