import { BsExclamationTriangleFill } from "react-icons/bs";
import { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { pageHeading } from "~/components/styles";
import { AllStageCostumes } from "~/features/costumes/costumesStage";
import { formatTitle } from "~/utils/htmlHeader";
import type { Route } from "./+types/route";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = formatTitle(data?.costume.name ?? "衣装が見つかりません。");

  return [{ title }, { name: "description", content: "高嶺のなでしこの楽曲" }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { costumeSlug } = params;

  if (costumeSlug == undefined) {
    throw new Response("", { status: 404 });
  }

  const costume = AllStageCostumes.find((x) => x.slug === costumeSlug);

  if (costume == undefined) {
    throw new Response("", { status: 404 });
  }

  return { costume };
};

export default function Component({ loaderData }: Route.ComponentProps) {
  const { costume } = loaderData;

  return (
    <div>
      <div className="container mx-auto lg:max-w-5xl">
        <div className="px-4 py-4">
          <Breadcrumb
            items={[
              { label: "たかねこの", to: "/" },
              { label: "衣装", to: "/costumes" },
            ]}
          />
        </div>

        <section className="space-y-8 px-4 py-8">
          <h1 className={pageHeading()}>{costume.name}</h1>

          <div className="space-y-1 rounded-lg border border-amber-400 bg-amber-50 px-4 py-2">
            <p>
              <BsExclamationTriangleFill className="inline text-amber-400" />
              <span className="ml-2">工事中</span>
            </p>
            <p>このページは作成中です。</p>
          </div>
        </section>
      </div>
    </div>
  );
}
