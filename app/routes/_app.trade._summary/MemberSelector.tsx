import { Popover } from "@base-ui/react/popover";
import { HiCheck, HiChevronDown } from "react-icons/hi2";
import { AllMembers } from "~/features/profile/members.ts";
import { MemberDescription } from "~/features/profile/types.ts";

interface Props {
  selectedMember: MemberDescription | undefined;
  onSelect: (member: MemberDescription | undefined) => void;
}

export function MemberSelector({ selectedMember, onSelect }: Props) {
  const items = [
    {
      displayName: "全メンバー",
      image: "/takaneko/tennya.png",
      value: undefined,
    },
    ...AllMembers.map((member) => ({
      displayName: member.name,
      image: member.idPhoto.path,
      value: member,
    })),
  ];

  const selected = items.find((item) => item.value?.id === selectedMember?.id) ?? items[0];

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={selected.displayName}
        aria-description="メンバーで絞り込む"
        className="box-border flex h-10 items-center gap-1 rounded-full pr-2 pl-1 text-left text-gray-600 hover:bg-zinc-100"
      >
        <img src={selected.image} alt="" className="size-8 flex-none rounded-full object-cover" />
        <span className="flex size-6 flex-none items-center justify-center">
          <HiChevronDown aria-hidden="true" className="text-sm" />
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={16}
          collisionAvoidance={{
            side: "none",
            align: "none",
            fallbackAxisSide: "none",
          }}
          className="z-30"
        >
          <Popover.Popup
            aria-label="メンバー"
            className="max-h-(--available-height) max-w-(--available-width) overflow-y-auto rounded-xl border border-zinc-200 bg-white py-3 shadow-md"
          >
            <ul>
              {items.map((item) => {
                const isSelected = item.value?.id === selectedMember?.id;
                return (
                  <li key={item.displayName}>
                    <Popover.Close
                      aria-current={isSelected}
                      className="flex w-full items-center gap-2 py-1 pr-6 pl-2 text-base text-gray-600 hover:bg-zinc-100 focus-visible:bg-zinc-100"
                      onClick={() => onSelect(item.value)}
                    >
                      <span aria-hidden="true" className="size-6 shrink-0 text-nadeshiko-900">
                        {isSelected && <HiCheck className="size-full" />}
                      </span>
                      <span className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt=""
                          className="size-8 shrink-0 rounded-full object-cover"
                        />
                        <span className="text-left">{item.displayName}</span>
                      </span>
                    </Popover.Close>
                  </li>
                );
              })}
            </ul>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
