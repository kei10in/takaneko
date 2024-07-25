export const ReadMe: React.FC = () => {
  return (
    <div className="m-4 text-lg">
      <p>生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。</p>
      <figure className="m-4 flex justify-center">
        <img src="/takaneko/sample.png" alt="サンプル" className="w-72 text-center" />
      </figure>

      <h2 className="text-xl font-bold">使い方:</h2>
      <ol className="mx-4 list-outside list-decimal pl-6">
        <li>右上のメニューから生写真・ミニフォトの種類を選択します。</li>
        <li>トレードしたい写真をタップします。。</li>
        <li className="">求 / 譲 / 1 / 2 / 3 / 4 / 5 / 6 から選択します。</li>
        <li>トレード用画像を表示して保存します。</li>
      </ol>
    </div>
  );
};
