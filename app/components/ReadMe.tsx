import { HiCog, HiNoSymbol } from "react-icons/hi2";

export const ReadMe: React.FC = () => {
  return (
    <div className="m-4 text-lg">
      <p>生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。</p>
      <figure className="m-4 flex justify-center">
        <img src="/takaneko/sample.png" alt="サンプル" className="w-72 text-center shadow-md" />
      </figure>

      <h2 className="mt-6 text-xl font-bold">スタンプ モード:</h2>
      <p>手早くトレードの設定ができます。</p>
      <h3 className="mt-2 text-lg font-bold">使い方:</h3>
      <ol className="mx-4 list-outside list-decimal pl-6">
        <li>右上のメニューから生写真・ミニフォトの種類を選択します。</li>
        <li>
          使いたいスタンプを <img className="inline h-6" src="/求.svg" alt="求" /> /{" "}
          <img className="inline h-6" src="/increment.svg" alt="+1" /> /{" "}
          <img className="inline h-6" src="/decrement.svg" alt="-1" /> /{" "}
          <HiNoSymbol className="inline-block" /> から選択します。
        </li>
        <li>写真をタップしてスタンプを捺します。</li>
        <li>トレード用画像を表示して保存します。</li>
      </ol>

      <h2 className="mt-6 text-xl font-bold">詳細モード:</h2>
      <p>
        写真をひとつづつ選んでトレードの設定ができます。写真が小さくてスタンプ
        モードが使いにくいときに使います。
      </p>
      <h3 className="mt-2 text-lg font-bold">使い方:</h3>
      <ol className="mx-4 list-outside list-decimal pl-6">
        <li>右上のメニューから生写真・ミニフォトの種類を選択します。</li>
        <li>
          <HiCog className="inline-block" /> を選択します。
        </li>
        <li>トレードしたい写真をタップして、写真の詳細を表示します。</li>
        <li>
          <HiNoSymbol className="inline-block" /> /{" "}
          <img className="inline h-6" src="/求.svg" alt="求" /> /{" "}
          <img className="inline h-6" src="/譲.svg" alt="譲" /> /{" "}
          <img className="inline h-6" src="/1.svg" alt="1" /> /{" "}
          <img className="inline h-6" src="/2.svg" alt="2" /> /{" "}
          <img className="inline h-6" src="/3.svg" alt="3" /> /{" "}
          <img className="inline h-6" src="/4.svg" alt="4" /> /{" "}
          <img className="inline h-6" src="/5.svg" alt="5" /> /{" "}
          <img className="inline h-6" src="/6.svg" alt="6" /> / から選択します。
        </li>
        <li>トレード用画像を表示して保存します。</li>
      </ol>
    </div>
  );
};
