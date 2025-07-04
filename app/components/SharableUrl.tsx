import { clsx } from "clsx";
import { BsBoxArrowUp } from "react-icons/bs";
import { CopyButton } from "./CopyButton";

interface Props {
  url: string;
  title: string;
  shareButton?: boolean;
  className?: string;
}

export const SharableUrl: React.FC<Props> = (props: Props) => {
  const { url, title, shareButton: shareButton, className } = props;

  return (
    <div className={clsx(`flex items-center gap-1 text-gray-600`, className)}>
      <div className="h-8 flex-1">
        <input
          className="h-full w-full rounded-md border border-gray-200 px-2 font-mono text-sm"
          readOnly
          value={url}
        />
      </div>
      <div className="flex flex-none items-center justify-end">
        {shareButton && (
          <button
            className="group flex h-8 w-8 items-center justify-center overflow-hidden rounded-md p-2 hover:bg-gray-100"
            onClick={async () => {
              if (window?.navigator?.share == undefined) {
                return;
              }

              await window.navigator.share({
                title: title,
                text: "",
                url: url,
              });
            }}
          >
            <BsBoxArrowUp className="h-4 w-4 text-gray-600" />
          </button>
        )}
        <CopyButton className="flex-none" data={url} />
      </div>
    </div>
  );
};
