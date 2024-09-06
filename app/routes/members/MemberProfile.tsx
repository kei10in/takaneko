import { Link } from "@remix-run/react";
import { FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { MemberDescription } from "./members";

interface Props {
  profile: MemberDescription;
}

export const MemberProfile: React.FC<Props> = (props: Props) => {
  const { profile } = props;
  const {
    name,
    kana,
    romaji,
    birthday,
    bloodType,
    constellation,
    birthplace,
    memberColor,
    fanName,
    nyadeshiko,
    hashTag,
    image,
    officialProfile,
    twitter,
    instagram,
    tiktok,
    showroom,
  } = profile;

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
        <h1 className="my-2 text-3xl font-semibold text-nadeshiko-800 lg:mt-12">{name}</h1>

        <div className="flex gap-4 text-gray-500">
          <p>{kana}</p>
          <p>{romaji}</p>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-2">
          <dt className="text-gray-400">血液型</dt>
          <dd className="col-span-2">{bloodType}</dd>
          <dt className="text-gray-400">生年月日</dt>
          <dd className="col-span-2">{birthday}</dd>
          <dt className="text-gray-400">星座</dt>
          <dd className="col-span-2">{constellation}</dd>
          <dt className="text-gray-400">出身地</dt>
          <dd className="col-span-2">{birthplace}</dd>
          <dt className="text-gray-400">メンバーカラー</dt>
          <dd className="col-span-2">{memberColor}</dd>
          <dt className="text-gray-400">ファンネーム</dt>
          <dd className="col-span-2">{fanName}</dd>
          <dt className="text-gray-400">にゃでしこ</dt>
          <dd className="col-span-2">{nyadeshiko}</dd>
          <dt className="text-gray-400">ハッシュタグ</dt>
          <dd className="col-span-2">
            <Link
              className="text-nadeshiko-800"
              to={`https://x.com/search?q=${encodeURIComponent(hashTag)}`}
              target="_blank"
              rel="noreferrer"
            >
              {hashTag}
            </Link>
          </dd>
        </dl>
        <li className="mt-8 flex gap-4 text-black">
          <ul>
            <Link to={officialProfile} target="_blank" rel="noreferrer">
              <img
                className="block h-6 w-6 rounded-md"
                src="/takaneko/logo.jpg"
                alt="オフィシャル ウェブサイト"
              />
            </Link>
          </ul>
          <ul>
            <Link to={twitter} target="_blank" rel="noreferrer">
              <FaXTwitter className="h-6 w-6" />
            </Link>
          </ul>
          <ul>
            <Link to={instagram} target="_blank" rel="noreferrer">
              <FaInstagram className="h-6 w-6" />
            </Link>
          </ul>
          <ul>
            <Link to={tiktok} target="_blank" rel="noreferrer">
              <FaTiktok className="h-6 w-6" />
            </Link>
          </ul>
          <ul>
            <Link to={showroom} target="_blank" rel="noreferrer">
              <img className="block h-6 w-6" src="/showroom/showroom-icon.png" alt="SHOWROOM" />
            </Link>
          </ul>
        </li>
      </section>
    </div>
  );
};
