import clsx from "clsx";
import { useState } from "react";
import { BsCheck2, BsCopy } from "react-icons/bs";

interface Props {
  className: string;
  data: string;
}

export const CopyButton: React.FC<Props> = (props: Props) => {
  const { className, data } = props;

  const [state, setState] = useState<"ready" | "copied">("ready");

  return (
    <button
      className={clsx(
        className,
        "group flex h-9 w-9 items-center justify-center overflow-hidden rounded-md p-2 hover:bg-gray-100",
      )}
      onClick={async () => {
        await navigator.clipboard.writeText(data);
        setState("copied");
        setTimeout(() => {
          setState("ready");
        }, 1000);
      }}
      disabled={state == "copied"}
    >
      <BsCopy data-state={state} className="h-5 w-5 text-gray-600 data-[state=copied]:hidden" />
      <BsCheck2
        data-state={state}
        className="hidden h-5 w-5 text-nadeshiko-800 data-[state=copied]:block"
      />
    </button>
  );
};
