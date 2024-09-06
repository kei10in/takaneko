import { Link, MetaFunction } from "@remix-run/react";
import { FaDiscord, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { SITE_TITLE } from "~/constants";
import { AllMembers } from "./members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこ メンバー一覧",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">高嶺のなでしこ</h1>

        <ul className="list-disc space-y-2 pl-6 marker:text-gray-300">
          <li>
            <Link
              className="text-nadeshiko-700"
              to="https://takanenonadeshiko.jp/"
              target="_blank"
              rel="noreferrer"
            >
              オフィシャル ウェブサイト
            </Link>
          </li>
          <li>
            <Link
              className="text-nadeshiko-700"
              to="https://takanekofc.com"
              target="_blank"
              rel="noreferrer"
            >
              オフィシャル ファン クラブ
            </Link>
          </li>
          <li>
            <Link
              className="text-nadeshiko-700"
              to="https://takanenonadeshiko-ec.com/"
              target="_blank"
              rel="noreferrer"
            >
              オフィシャル ショップ
            </Link>
          </li>
        </ul>

        <ul className="my-4 flex gap-2 px-2 text-gray-700">
          <li>
            <Link to="https://www.youtube.com/@official6743" target="_blank" rel="noreferrer">
              <FaYoutube className="h-5 w-5" />
            </Link>
          </li>
          <li>
            <Link to="https://x.com/takanenofficial" target="_blank" rel="noreferrer">
              <FaXTwitter className="h-5 w-5" />
            </Link>
          </li>
          <li>
            <Link to="https://www.instagram.com/takanenofficial/" target="_blank" rel="noreferrer">
              <FaInstagram className="h-5 w-5" />
            </Link>
          </li>
          <li>
            <Link to="https://www.tiktok.com/@takanenofficial" target="_blank" rel="noreferrer">
              <FaTiktok className="h-5 w-5" />
            </Link>
          </li>
          <li>
            <Link to="https://discord.gg/JE54h9trxm" target="_blank" rel="noreferrer">
              <FaDiscord className="h-5 w-5" />
            </Link>
          </li>
        </ul>

        <section>
          <h2 className="mb-4 mt-12 text-2xl font-semibold text-gray-400">メンバー</h2>

          <ul className="flex flex-wrap justify-center gap-4">
            {AllMembers.map((member) => (
              <li key={member.name} className="flex-none">
                <Link
                  className="flex h-44 w-80 flex-none flex-col overflow-hidden rounded-xl bg-white shadow-md"
                  to={`/members/${member.slug}`}
                >
                  <div
                    className="flex h-6 flex-none items-center justify-center font-serif text-white"
                    style={{ backgroundColor: member.color }}
                  >
                    高嶺のなでしこ
                  </div>
                  <div className="flex flex-1 items-stretch justify-stretch gap-3 p-3">
                    <div className="h-32 w-24 flex-none">
                      <img className="block h-32 w-24" src={member.idPhoto.path} alt="証明写真" />
                    </div>
                    <div className="flex-1 bg-white bg-opacity-95 bg-[url('/takaneko/emblem.png')] bg-contain bg-center bg-no-repeat bg-blend-lighten">
                      <dl className="grid grid-cols-3 items-end gap-2 py-1">
                        <dt className="col-span-1 text-xs leading-none">学籍番号</dt>
                        <dd className="col-span-2 text-xs leading-none">
                          20220807{member.number.toString().padStart(2, "0")}
                        </dd>
                        <dt className="col-span-1 text-xs leading-none">学科</dt>
                        <dd className="col-span-2 text-xs leading-none">{member.fanName}</dd>
                        <dt className="col-span-1 text-xs leading-none">氏名</dt>
                        <dd className="col-span-2 text-lg font-semibold leading-none">
                          {member.name}
                        </dd>
                        <dt className="col-span-1 text-xs leading-none"></dt>
                        <dd className="col-span-2 text-xs leading-none">{member.nickname}</dd>
                        <dt className="col-span-1 text-xs leading-none">生年月日</dt>
                        <dd className="col-span-2 text-xs leading-none">{member.birthday}</dd>
                        <dt className="col-span-1 text-xs leading-none">血液型</dt>
                        <dd className="col-span-2 text-xs leading-none">{member.bloodType}</dd>
                      </dl>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 mt-12 text-2xl font-semibold text-gray-400">マネージャー</h2>

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
                  <div className="flex-1 bg-white bg-opacity-90 bg-[url('/takaneko/emblem.png')] bg-contain bg-center bg-no-repeat bg-blend-lighten">
                    <p>たかねこまねーじゃー</p>
                    <ul className="mt-2 flex gap-2 text-nadeshiko-700"></ul>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </section>
      </section>
    </div>
  );
}
