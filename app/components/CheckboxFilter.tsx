import { Checkbox } from "@base-ui/react/checkbox";
import { clsx } from "clsx";

interface CheckboxFilterProps<T extends string | number> {
  label: string;
  values: T[];
  onChange: (values: T[]) => void;
  options: { value: T; label: string }[];
}

export function CheckboxFilter<T extends string | number>({
  label,
  values,
  onChange,
  options,
}: CheckboxFilterProps<T>) {
  const updateValue = (value: T, checked: boolean) => {
    if (checked) {
      onChange(values.includes(value) ? values : [...values, value]);
      return;
    }

    onChange(values.filter((selected) => selected !== value));
  };

  return (
    <fieldset className="space-y-2">
      <legend className="block font-semibold text-gray-600">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Checkbox.Root
            key={option.value}
            checked={values.includes(option.value)}
            onCheckedChange={(checked) => updateValue(option.value, checked)}
            className={clsx(
              "group flex h-10 items-center justify-center rounded-full px-4 text-base select-none",
              "bg-zinc-100 font-semibold text-zinc-500 hover:bg-zinc-200 hover:text-zinc-600",
              "data-checked:box-content data-checked:border-0 data-checked:graceful-selected-item",
            )}
          >
            {option.label}
          </Checkbox.Root>
        ))}
      </div>
    </fieldset>
  );
}
