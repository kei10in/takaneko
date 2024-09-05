import { Link } from "@remix-run/react";
import { FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { HiCamera } from "react-icons/hi2";
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
    hashTags,
    officialProfile,
    twitter,
    instagram,
    tiktok,
    showroom,
  } = profile;

  return (
    <div className="mx-auto max-w-5xl py-8 lg:grid lg:grid-cols-2">
      <div className="mx-8 h-[30rem] bg-gray-100">
        <div className="flex h-full w-full items-center justify-center">
          <HiCamera className="h-24 w-24 text-gray-400" />
        </div>
      </div>
      <section className="px-4">
        <h1 className="mb-2 mt-8 text-3xl font-semibold text-nadeshiko-800">{name}</h1>

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
          <dt className="text-gray-400">ハッシュタグ</dt>
          <dd className="col-span-2">{hashTags}</dd>
        </dl>
        <li className="mt-8 flex gap-4 text-black">
          <ul>
            <Link to={officialProfile} target="_blank" rel="noreferrer">
              <img
                className="block h-8 w-8 rounded-md"
                src="/takaneko/logo.jpg"
                alt="オフィシャル ウェブサイト"
              />
            </Link>
          </ul>
          <ul>
            <Link to={twitter} target="_blank" rel="noreferrer">
              <FaXTwitter className="h-8 w-8" />
            </Link>
          </ul>
          <ul>
            <Link to={instagram} target="_blank" rel="noreferrer">
              <FaInstagram className="h-8 w-8" />
            </Link>
          </ul>
          <ul>
            <Link to={tiktok} target="_blank" rel="noreferrer">
              <FaTiktok className="h-8 w-8" />
            </Link>
          </ul>
          <ul>
            <Link to={showroom} target="_blank" rel="noreferrer">
              <img className="block h-8 w-8" src="/showroom/showroom-icon.png" alt="SHOWROOM" />
            </Link>
          </ul>
        </li>
      </section>
    </div>
  );
};
