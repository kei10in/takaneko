import { Link, MetaFunction } from "@remix-run/react";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";
import { SITE_TITLE } from "~/constants";

export const meta: MetaFunction = () => {
  return [
    { title: `葉月 紗蘭 プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 葉月 紗蘭 のプロフィールです。",
    },
  ];
};

export default function Index() {
  const name = "たかねこまねーじゃー";
  const kana = "マネージャー";
  const romaji = "Maneger";
  const nyadeshiko = "てんにゃ";
  const twitter = "https://x.com/takanekomanager";
  const tiktok = "https://www.tiktok.com/@takanenokawachiofficial";

  return (
    <div className="container mx-auto">
      <div className="mx-auto max-w-5xl py-8 lg:grid lg:grid-cols-2">
        <div className="mx-8 h-[30rem]">
          <img
            className="mx-auto block h-full object-contain"
            src="/takaneko/tennya.png"
            alt="てんにゃ"
          />
        </div>
        <section className="px-4">
          <h1 className="mb-2 mt-8 text-3xl font-semibold text-nadeshiko-800">{name}</h1>

          <div className="flex gap-4 text-gray-500">
            <p>{kana}</p>
            <p>{romaji}</p>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-2">
            <dt className="text-gray-400">にゃでしこ</dt>
            <dd className="col-span-2">{nyadeshiko}</dd>
          </dl>
          <li className="mt-8 flex gap-4 text-black">
            <ul>
              <Link to={twitter} target="_blank" rel="noreferrer">
                <FaXTwitter className="h-8 w-8" />
              </Link>
            </ul>
            <ul>
              <Link to={tiktok} target="_blank" rel="noreferrer">
                <FaTiktok className="h-8 w-8" />
              </Link>
            </ul>
          </li>
        </section>
      </div>{" "}
    </div>
  );
}
