import { ReactNode } from "react";
import { HiArrowUpRight } from "react-icons/hi2";
import { Link } from "react-router";

export const Statistic = ({
  label,
  value,
  unit,
  detail,
  to,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  detail?: ReactNode;
  to?: string;
}) => {
  const card = (
    <div className="relative space-y-1 rounded-2xl bg-zinc-50 p-4 in-[a:hover]:bg-zinc-100">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-2 line-clamp-1 text-2xl font-semibold text-zinc-800 tabular-nums">
        {value}
        {unit == undefined ? null : (
          <span className="ml-1 text-sm font-normal text-zinc-500">{unit}</span>
        )}
      </dd>
      <dd className="line-clamp-1 min-h-lh text-xs text-zinc-500">{detail}</dd>
    </div>
  );

  return to == undefined ? (
    card
  ) : (
    <Link to={to} className="relative block">
      {card}
      <HiArrowUpRight className="absolute top-4 right-4 size-4 text-zinc-400" aria-hidden="true" />
    </Link>
  );
};
