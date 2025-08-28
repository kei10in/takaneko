import { Field, Label, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Fragment, useMemo } from "react";
import { BsGear } from "react-icons/bs";
import { Link } from "react-router";
import { CopyButton } from "~/components/CopyButton";
import { Switch } from "~/components/Switch";
import { formatSetlist, Segment } from "~/features/events/setlist";
import { useEventCalendarStore } from "~/features/events/store";
import { LinkDescription } from "~/utils/types/LinkDescription";
import { SetlistItem } from "./SetlistItem";

interface Props {
  setlist: Segment[];
  links: LinkDescription[];
}

export const Setlist: React.FC<Props> = (props: Props) => {
  const { setlist, links } = props;

  const copyWithMC = useEventCalendarStore((state) => state.copyWithMC);
  const copyWithOrder = useEventCalendarStore((state) => state.copyWithOrder);
  const updateCopySettings = useEventCalendarStore((state) => state.updateCopySettings);

  const setlistText = useMemo(() => {
    return formatSetlist(setlist, { copyWithMC, copyWithOrder });
  }, [setlist, copyWithMC, copyWithOrder]);

  return (
    <section>
      <h4 className="font-bold text-gray-500">セットリスト</h4>

      <ul className="mt-1 divide-y divide-gray-100 pb-4">
        {setlist.map((part, i) => {
          return <SetlistItem key={i} part={part} />;
        })}
      </ul>

      <div className="flex justify-end gap-1">
        {links.length > 0 && (
          <p className="flex-1 pb-4 pl-6 text-xs text-gray-400">
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

        <div className="flex-none">
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
        </div>
        <div className="flex-none">
          <CopyButton data={setlistText} />
        </div>
      </div>
    </section>
  );
};
