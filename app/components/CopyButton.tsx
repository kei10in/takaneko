import { clsx } from "clsx";
import { useState } from "react";
import { BsCheck2, BsCopy } from "react-icons/bs";

interface Props {
  className?: string;
  data: string;
  text?: boolean;
}

export const CopyButton: React.FC<Props> = (props: Props) => {
  const { className, data, text = false } = props;

  const [state, setState] = useState<"ready" | "copied">("ready");

  return (
    <button
      data-state={state}
      className={clsx(
        className,
        "group flex h-8 items-center gap-2 overflow-hidden rounded-md p-2 text-gray-600 hover:bg-gray-100",
        "data-[state=copied]:text-nadeshiko-800",
      )}
      onClick={async () => {
        if (navigator?.clipboard?.writeText != undefined) {
          await navigator.clipboard.writeText(data);
        }

        setState("copied");
        setTimeout(() => {
          setState("ready");
        }, 1000);
      }}
      disabled={state == "copied"}
    >
      <div className="flex flex-none items-center justify-center overflow-hidden">
        <BsCopy className="h-4 w-4 text-gray-600 group-data-[state=copied]:hidden" />
        <BsCheck2 className="hidden h-4 w-4 text-nadeshiko-800 group-data-[state=copied]:block" />
      </div>
      {text && (
        <div className="text-gray-600">
          <div className="group-data-[state=copied]:hidden">コピー</div>
          <div className="hidden text-nadeshiko-800 group-data-[state=copied]:block">完了</div>
        </div>
      )}
    </button>
  );
};
