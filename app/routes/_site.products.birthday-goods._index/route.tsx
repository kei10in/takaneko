import { clsx } from "clsx";
import { Link, MetaFunction } from "react-router";
import { SquareCard } from "~/components/SquareCard";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import { BirthdayGoods } from "~/features/products/birthdayGoods";
import { findMemberDescription } from "~/features/profile/members";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { thumbnailSrcSet } from "~/utils/fileConventions";

export const meta: MetaFunction = () => {
  return [
    { title: `誕生日記念グッズ - ${SITE_TITLE}` },
    {
      name: "description",
      content:
        "高嶺のなでしこのメンバーの誕生部記念グッズの一覧です。" +
        "高嶺のなでしこ 2 周年以降、各メンバーの誕生日にそれぞれのメンバーが企画した誕生日記念グッズが販売されています。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto text-gray-600">
      <section className={pageBox()}>
        <h1 className={pageHeading("my-4 px-4")}>誕生日記念グッズ</h1>

        <div className="space-y-2 px-4">
          <p>
            高嶺のなでしこ 2
            周年以降、各メンバーの誕生日にそれぞれのメンバーが企画した誕生日記念グッズが販売されています。
          </p>
          <p>誕生日当日にラインナップが発表され、約 1 週間の受注販売が行われます。</p>
          <p>
            ここでは、これまでに販売された誕生日記念グッズの一覧を掲載しています。
            各グッズの詳細は、各メンバーの誕生日記念グッズのページをご覧ください。
          </p>
        </div>

        <section className="@container mt-8 px-4">
          <h2 className={sectionHeading()}>誕生日記念グッズ 一覧</h2>

          <div
            className={clsx(
              "mt-6 grid grid-cols-2 gap-x-2 gap-y-8",
              "@md:grid-cols-3 @xl:grid-cols-4 @3xl:grid-cols-5 @5xl:grid-cols-6",
            )}
          >
            {BirthdayGoods.map((bg) => {
              const member = findMemberDescription(bg.memberName);
              const thumbs = thumbnailSrcSet(bg.images[0].path);

              return (
                <Link key={bg.slug} className="block" to={`/products/birthday-goods/${bg.slug}`}>
                  <SquareCard
                    image={thumbs.src}
                    imageSet={thumbs.srcset}
                    title={member.name}
                    description={displayDate(NaiveDate.parseUnsafe(bg.date))}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </div>
  );
}
