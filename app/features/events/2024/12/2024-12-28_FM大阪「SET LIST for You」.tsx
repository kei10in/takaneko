import { Link } from "react-router";

export const meta = {
  summary: "FM大阪「SET LIST for You」",
  category: "RADIO",
  date: "2024-12-28",
  start: "06:00",
  end: "07:00",
  region: "ラジオ",
  present: ["涼海すう", "東山恵里沙", "籾山ひめり"],
  // images: [
  //   {
  //     path: "/events/2024/2024-12-28_",
  //     ref: "",
  //   },
  // ],
  link: {
    text: "告知",
    url: "https://x.com/fmosaka851/status/1872386654398279819",
  },
  links: [
    "[radiko 放送会](https://radiko.jp/share?sid=FMO&t=20241228060000)",
    "[FM 大阪 X 告知](https://x.com/fmosaka851/status/1872386654398279819)",
  ],
};

const Content: React.FC = () => {
  return (
    <>
      <h2>セットリスト</h2>

      <details>
        <summary>
          涼海すう -{" "}
          <Link
            to="https://radiko.jp/share?sid=FMO&t=20241228060040"
            target="_blank"
            rel="noopener noreferrer"
          >
            00:00:40 (radiko)
          </Link>
        </summary>
        <ul>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=OIBODIPC_8Y"
              target="_blank"
              rel="noopener noreferrer"
            >
              YOASOBI「勇者」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=v-WcMQbXbKY"
              target="_blank"
              rel="noopener noreferrer"
            >
              緑黄色社会「花になって」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=UA5JjEePTwU"
              target="_blank"
              rel="noopener noreferrer"
            >
              兎田ぺこら・宝鐘マリン「ブライダルドリーム」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=zuoVd2QNxJo"
              target="_blank"
              rel="noopener noreferrer"
            >
              キタニタツヤ「青のすみか」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=8ZP5eqm4JqM"
              target="_blank"
              rel="noopener noreferrer"
            >
              星街すいせい「ビビデバ」
            </Link>
          </li>
        </ul>
      </details>

      <details>
        <summary>
          東山恵里沙 -{" "}
          <Link
            to="https://radiko.jp/share?sid=FMO&t=20241228061555"
            target="_blank"
            rel="noopener noreferrer"
          >
            00:15:55 (radiko)
          </Link>
        </summary>
        <ul>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=17NBPoc78oM"
              target="_blank"
              rel="noopener noreferrer"
            >
              =LOVE「絶対アイドル辞めないで」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=Y4KjiTGBggw"
              target="_blank"
              rel="noopener noreferrer"
            >
              超ときめき♡宣伝部「最上級にかわいいの！」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=e8rbEdXwQ_c"
              target="_blank"
              rel="noopener noreferrer"
            >
              きゅるりんってしてみて「ツインテールは20歳まで♡」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=bRRPqGRguKo"
              target="_blank"
              rel="noopener noreferrer"
            >
              FRUITS ZIPPER「フルーツバスケット」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=n_8LTS92LXE"
              target="_blank"
              rel="noopener noreferrer"
            >
              高嶺のなでしこ「アドレナリンゲーム」
            </Link>
          </li>
        </ul>
      </details>

      <details>
        <summary>
          籾山ひめり -{" "}
          <Link
            to="https://radiko.jp/share?sid=FMO&t=20241228063300"
            target="_blank"
            rel="noopener noreferrer"
          >
            00:33:00 (radiko)
          </Link>
        </summary>
        <ul>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=5cN8FONHbuc"
              target="_blank"
              rel="noopener noreferrer"
            >
              wacci「どんな小さな」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=A7cp6OVa0Qc"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official髭男dism「Same Blue」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=L8Xf8CFPlp0"
              target="_blank"
              rel="noopener noreferrer"
            >
              WurtS「SF東京」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=VmSNNOTB_FE"
              target="_blank"
              rel="noopener noreferrer"
            >
              aiko「相思相愛」
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/watch?v=IKjRLKQo7O0"
              target="_blank"
              rel="noopener noreferrer"
            >
              プリンセス プリンセス「Diamonds」
            </Link>
          </li>
        </ul>
      </details>
    </>
  );
};

export default Content;
