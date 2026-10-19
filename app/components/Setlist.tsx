import { Field, Label, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Fragment, useMemo } from "react";
import { BsGear } from "react-icons/bs";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { Link } from "react-router";
import { CopyButton } from "~/components/CopyButton.tsx";
import { Switch } from "~/components/Switch.tsx";
import { formatSetlist, Segment } from "~/features/events/setlist.ts";
import { useEventCalendarStore } from "~/features/events/store.ts";
import { LinkDescription } from "~/utils/types/LinkDescription.ts";
import { SetlistItem } from "./SetlistItem.tsx";

interface Props {
  setlist: Segment[];
  links: LinkDescription[];
}

export const Setlist: React.FC<Props> = (props: Props) => {
  const { setlist, links } = props;
  const songCount = setlist.filter((segment) => segment.kind == "song").length;

  const copyWithMC = useEventCalendarStore((state) => state.copyWithMC);
  const copyWithOrder = useEventCalendarStore((state) => state.copyWithOrder);
  const updateCopySettings = useEventCalendarStore((state) => state.updateCopySettings);

  const setlistText = useMemo(() => {
    return formatSetlist(setlist, { copyWithMC, copyWithOrder });
  }, [setlist, copyWithMC, copyWithOrder]);

  return (
    <div>
      <ul className="mt-1 divide-y divide-gray-100 border-b border-gray-100">
        {setlist.map((part, i) => {
          return <SetlistItem key={i} part={part} />;
        })}
      </ul>

      <div className="px-0.5 pt-2">
        <div className="flex items-center justify-between gap-1">
          <p className="flex items-center gap-1 text-base text-zinc-500">
            <HiOutlineMusicalNote aria-hidden="true" className="size-4 text-nadeshiko-600" />
            {songCount} 曲
          </p>
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverButton className="h-8 w-8 rounded-md p-2 text-gray-600 hover:bg-gray-100">
                <BsGear />
              </PopoverButton>
              <PopoverPanel anchor={{ to: "bottom" }} className="w-60 p-4">
                <div className="rounded-lg border border-gray-100 bg-white shadow-lg">
                  <div className="divide-y divide-gray-100 px-2">
                    <Field className="flex items-center gap-1 px-2 py-2 select-none">
                      <Label className="flex-1 text-sm text-gray-600">曲順を含める</Label>
                      <Switch
                        checked={copyWithOrder}
                        onChange={(checked) => updateCopySettings({ copyWithOrder: checked })}
                      />
                    </Field>
                    <Field className="flex items-center gap-1 px-2 py-2 select-none">
                      <Label className="flex-1 text-sm text-gray-600">MC を含める</Label>
                      <Switch
                        checked={copyWithMC}
                        onChange={(checked) => updateCopySettings({ copyWithMC: checked })}
                      />
                    </Field>
                  </div>
                </div>
              </PopoverPanel>
            </Popover>
            <CopyButton data={setlistText} />
          </div>
        </div>
        {links.length > 0 && (
          <p className="truncate pt-2 pb-4 text-xs text-nowrap text-gray-400">
            出典:{" "}
            <Link
              className="text-nadeshiko-600"
              to={links[0].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {links[0].text}
            </Link>
            {links.slice(1).map((link) => (
              <Fragment key={link.url}>
                <span>{" / "}</span>
                <Link
                  className="text-nadeshiko-600"
                  to={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.text}
                </Link>
              </Fragment>
            ))}
          </p>
        )}
      </div>
    </div>
  );
};
