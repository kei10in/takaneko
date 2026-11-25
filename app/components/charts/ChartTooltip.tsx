import type { ReactNode, Ref } from "react";

export const ChartTooltip = ({
  title,
  entries,
  ref,
}: {
  title: ReactNode;
  entries: { label: string; color: string; value: string }[];
  ref?: Ref<HTMLDivElement>;
}) => (
  <div
    ref={ref}
    role="tooltip"
    className="min-w-32 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs whitespace-nowrap shadow-md"
  >
    <p className="mb-2 font-medium text-zinc-900">{title}</p>
    <dl className="space-y-1.5">
      {entries.map(({ label, color, value }, index) => (
        <div key={index} className="flex items-baseline justify-between gap-4">
          <dt className="flex items-center gap-2 text-left font-semibold text-zinc-500">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            {label}
          </dt>
          <dd className="text-right font-medium text-zinc-900 tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  </div>
);
