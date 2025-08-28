import { Switch as HeadlessSwitch } from "@headlessui/react";
import { clsx } from "clsx";

interface Props {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
}

export const Switch: React.FC<Props> = ({ checked, onChange, name }: Props) => {
  return (
    <HeadlessSwitch
      className={clsx(
        "group flex w-9.5 flex-none cursor-pointer overflow-hidden rounded-full p-0.5 transition-colors ease-in-out",
        "focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white",
        "data-checked:bg-nadeshiko-800 bg-gray-200",
        "text-left data-checked:text-right",
      )}
      checked={checked}
      onChange={onChange}
      name={name}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none inline-block size-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          "translate-x-0 group-data-checked:translate-x-3.5",
        )}
      />
    </HeadlessSwitch>
  );
};
