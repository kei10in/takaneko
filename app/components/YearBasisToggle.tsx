import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { clsx } from "clsx";

export type YearBasis = "career" | "calendar";

const options: { value: YearBasis; label: string }[] = [
  { value: "career", label: "活動年" },
  { value: "calendar", label: "西暦" },
];

export const YearBasisToggle = ({
  value,
  onChange,
}: {
  value: YearBasis;
  onChange: (value: YearBasis) => void;
}) => (
  <ToggleGroup
    aria-label="集計基準"
    value={[value]}
    onValueChange={([next]) => {
      if (next === "career" || next === "calendar") {
        onChange(next);
      }
    }}
    className="relative isolate grid h-10 shrink-0 grid-cols-2 rounded-full bg-zinc-100 p-1"
  >
    <span
      aria-hidden="true"
      className={clsx(
        "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out motion-reduce:transition-none",
        value === "calendar" && "translate-x-full",
      )}
    />
    {options.map((option) => (
      <Toggle
        key={option.value}
        value={option.value}
        className={clsx(
          "relative rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nadeshiko-600 motion-reduce:transition-none",
          value === option.value ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-700",
        )}
      >
        {option.label}
      </Toggle>
    ))}
  </ToggleGroup>
);
