import { FaTiktok, FaXTwitter } from "react-icons/fa6";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { Link, MetaFunction } from "react-router";
import { TwitterHashTag } from "~/components/TwitterHashTag";
import { SITE_TITLE } from "~/constants";

export const meta: MetaFunction = () => {
  return [
    { title: `たかねこまねーじゃー プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのマネージャーのプロフィールです。",
    },
  ];
};

export default function Index() {
  const name = "たかねこまねーじゃー";
  const kana = "マネージャー";
  const romaji = "Manager";
  const nyadeshiko = "てんにゃ";
  const hashTags = [
    "#高嶺のなでしこ",
    "#たかねこ",
    "#カメねこ",
    "#あしたのたかねこ",
    "#たかねこだいじぇすと",
  ];

  const image = {
    path: "/takaneko/tennya.png",
    ref: "https://x.com/takanekomanager",
  };
  const twitter = "https://x.com/takanekomanager";
  const tiktok = "https://www.tiktok.com/@takanenokawachiofficial";

  return (
    <div className="mx-auto pb-12 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-4 lg:py-12">
      <div className="w-full">
        <div className="mx-auto w-fit">
          <img
            className="block h-[28rem] object-cover object-center lg:h-[36rem]"
            src={image.path}
            alt="プロフィール"
          />
          <Link className="text-sm text-gray-400" to={image.ref} target="_blank" rel="noreferrer">
            <p className="text-right">
              引用元 <HiArrowTopRightOnSquare className="inline" />
            </p>
          </Link>
        </div>
      </div>

      <section className="p-4">
        <h1 className="text-nadeshiko-800 my-2 text-3xl font-semibold lg:mt-12">{name}</h1>

        <div className="flex gap-4 text-gray-500">
          <p>{kana}</p>
          <p>{romaji}</p>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-2">
          <dt className="text-gray-400">にゃでしこ</dt>
          <dd className="col-span-2">{nyadeshiko}</dd>

          <dt className="text-gray-400">ハッシュタグ</dt>
          <dd className="col-span-2">
            <ul>
              {hashTags.map((hashTag) => (
                <li key={hashTag}>
                  <TwitterHashTag className="text-nadeshiko-800" hashTag={hashTag} />
                </li>
              ))}
            </ul>
          </dd>
        </dl>
        <li className="mt-8 flex gap-4 text-black">
          <ul>
            <Link to={twitter} target="_blank" rel="noreferrer">
              <FaXTwitter className="h-6 w-6" />
            </Link>
          </ul>
          <ul>
            <Link to={tiktok} target="_blank" rel="noreferrer">
              <FaTiktok className="h-6 w-6" />
            </Link>
          </ul>
        </li>
      </section>
    </div>
  );
}
