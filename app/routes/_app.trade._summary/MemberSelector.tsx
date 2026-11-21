import { CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { BsCheck, BsChevronDown } from "react-icons/bs";
import { AllMembers } from "~/features/profile/members.ts";
import { MemberDescription } from "~/features/profile/types.ts";

interface Props {
  selectedMember: MemberDescription | undefined;
  onSelect: (member: MemberDescription | undefined) => void;
}

export function MemberSelector({ selectedMember, onSelect }: Props) {
  return (
    <div className="shrink-0 pr-4">
      <Popover className="w-28">
        <PopoverButton className="flex w-full items-center justify-between text-sm text-gray-600">
          <div className="mx-auto flex-1 pl-2">メンバー</div>
          <div className="flex-none px-1">
            <BsChevronDown className="text-xs" />
          </div>
        </PopoverButton>
        <PopoverPanel
          anchor={{ to: "bottom end", gap: "0.5rem" }}
          className="overflow-hidden rounded-sm border border-nadeshiko-100 bg-nadeshiko-50 py-2 shadow-md"
        >
          <ul className="min-w-60">
            <li>
              <CloseButton
                className={clsx(
                  "flex items-center gap-2",
                  "w-full px-6 py-1 text-base text-gray-600 hover:bg-nadeshiko-300",
                  "data-current:bg-nadeshiko-700 data-current:text-white",
                )}
                onClick={() => onSelect(undefined)}
              >
                <div className="h-6 w-6 text-nadeshiko-800">
                  {selectedMember == undefined ? <BsCheck className="h-full w-full" /> : null}
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/takaneko/tennya.png"
                    alt="全員"
                    className="h-8 w-8 rounded-full bg-white object-cover object-top"
                  />
                  <p>全員</p>
                </div>
              </CloseButton>
            </li>
            {AllMembers.map((c) => (
              <li key={c.id}>
                <CloseButton
                  className={clsx(
                    "flex items-center gap-2",
                    "w-full px-6 py-1 text-base text-gray-600 hover:bg-nadeshiko-300",
                    "data-current:bg-nadeshiko-700 data-current:text-white",
                  )}
                  onClick={() => onSelect(c)}
                >
                  <div className="h-6 w-6 text-nadeshiko-800">
                    {c.id == selectedMember?.id ? <BsCheck className="h-full w-full" /> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={c.idPhoto.path}
                      alt={c.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <p>{c.name}</p>
                  </div>
                </CloseButton>
              </li>
            ))}
          </ul>
        </PopoverPanel>
      </Popover>
    </div>
  );
}
