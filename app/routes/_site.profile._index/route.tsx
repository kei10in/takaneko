import { BsDiscord, BsInstagram, BsTwitterX, BsYoutube } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa6";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { SiBereal, SiBilibili, SiSinaweibo, SiTiktok, SiXiaohongshu } from "react-icons/si";
import { Link, MetaFunction } from "react-router";
import { pageBox } from "~/components/styles";
import { formatTitle } from "~/utils/htmlHeader";
import { CurrentMembers } from "../../features/profile/members";
import { MemberIdCard } from "../_site.members._index/MemberIdCard";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`プロフィール`) },
    {
      name: "description",
      content: "高嶺のなでしこ メンバー一覧",
    },
  ];
};

const SocialMedia = [
  {
    url: "https://www.youtube.com/@official6743",
    icon: BsYoutube,
  },
  {
    url: "https://x.com/takanenofficial",
    icon: BsTwitterX,
  },
  {
    url: "https://www.instagram.com/takanenofficial/",
    icon: BsInstagram,
  },
  {
    url: "https://www.tiktok.com/@takanenofficial",
    icon: FaTiktok,
  },
  {
    url: "https://discord.gg/JE54h9trxm",
    icon: BsDiscord,
  },
  {
    url: "https://bere.al/takanenofficial",
    icon: SiBereal,
  },
];

const ChineseSocialMedia = [
  {
    url: "https://space.bilibili.com/3493257990375590",
    icon: SiBilibili,
  },
  {
    url: "https://weibo.com/u/7953892369",
    icon: SiSinaweibo,
  },
  {
    url: "https://www.xiaohongshu.com/user/profile/670366fd000000001d033fdf",
    icon: SiXiaohongshu,
  },
  {
    url: "https://v.douyin.com/iACQBTWT/",
    icon: SiTiktok,
  },
];

export default function Index() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox("my-8 px-4")}>
        <h1 className={"text-5xl"}>プロフィール</h1>

        <div className="mt-12 space-y-24">
          <section className="space-y-8">
            <h2 className={"text-3xl"}>高嶺のなでしこ</h2>

            <ul className="mb-4 flex gap-4 px-2">
              {SocialMedia.map((media) => (
                <li key={media.url}>
                  <Link
                    className="flex size-6 items-center justify-center rounded"
                    to={media.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <media.icon className="h-full w-full" />
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="flex gap-4 px-2">
              {ChineseSocialMedia.map((media) => (
                <li key={media.url}>
                  <Link
                    className="flex size-6 items-center justify-end rounded"
                    to={media.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <media.icon className="h-full w-full" />
                  </Link>
                </li>
              ))}
            </ul>

            <div>
              <img
                className="aspect-4/3 w-full overflow-hidden rounded-3xl object-cover"
                src="/takaneko/profile/2025-08-02_TIF2025-Day2.jpg"
                alt="高嶺のなでしこの集合写真"
              />
              <p className="mx-4 pt-1 text-right text-sm text-zinc-500">
                <Link
                  to="https://x.com/hina_hinahata/status/1951645089165651992"
                  target="_blank"
                  rel="noreferrer"
                >
                  画像の引用元 <HiArrowTopRightOnSquare className="inline" />
                </Link>
              </p>
            </div>

            <p>
              2022 年 8 月に結成された、HoneyWorks がサウンドプロデュースを手がける 9
              人組女性アイドルグループです。
            </p>
            <p>
              青春ラブソングから熱血アイドルソング、HoneyWorks
              の人気楽曲のカバーまで、幅広い楽曲が魅力です。
              ビジュアルや性格などメンバーそれぞれの個性も豊かで、初めて知る人でもきっと推しメンが見つかるはず。
            </p>
          </section>

          <section className="space-y-8">
            <h2 className={"text-3xl"}>メンバー</h2>

            <ul className="flex flex-wrap justify-center gap-4">
              {CurrentMembers.map((member) => (
                <li key={member.name} className="flex-none">
                  <MemberIdCard member={member} />
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-8">
            <h2 className={"text-3xl"}>マネージャー</h2>

            <ul className="flex flex-wrap justify-center gap-4">
              <li className="flex-none">
                <Link
                  className="flex h-44 w-80 flex-none flex-col overflow-hidden rounded-xl bg-white shadow-md"
                  to={`/members/manager`}
                >
                  <div className="flex h-6 flex-none items-center justify-center bg-zinc-700 font-serif text-white">
                    高嶺のなでしこ
                  </div>
                  <div className="flex flex-1 items-stretch justify-stretch gap-3 p-3">
                    <div className="h-32 w-24 flex-none bg-gray-200">
                      <img
                        className="mx-auto block h-32 w-24 object-contain"
                        src="/takaneko/tennya.png"
                        alt="てんにゃ"
                      />
                    </div>
                    <div className="flex-1 bg-white/95 bg-[url('/takaneko/emblem.png')] bg-contain bg-center bg-no-repeat bg-blend-lighten">
                      <p>たかねこまねーじゃー</p>
                      <ul className="mt-2 flex gap-2 text-nadeshiko-700"></ul>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
}
