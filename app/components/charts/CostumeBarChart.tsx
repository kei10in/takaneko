import { clsx } from "clsx";
import { useState } from "react";
import { calculateChartDimensions } from "./scale";

interface Props {
  costume: {
    costumeName: string;
    value: number;
  }[];
}

export const CostumeBarChart: React.FC<Props> = ({ costume }: Props) => {
  const maxValue = Math.max(...costume.map((item) => item.value));

  const { limit } = calculateChartDimensions(maxValue);

  const main = costume.slice(0, 10);
  const rest = costume.slice(10);

  const collapsedHeight = rest.length * (10 + 32); // 10 = space-y-2.5, 32 = bar の高さ

  const [open, setOpen] = useState(false);

  return (
    <div className="w-full space-y-2.5">
      <div className="space-y-2.5">
        {main.map(({ costumeName, value }) => (
          <Bar key={costumeName} costumeName={costumeName} value={value} limit={limit} />
        ))}

        {rest.length > 0 && (
          <div data-open={open ? "true" : undefined} className="group">
            <div
              className={clsx("space-y-2.5 overflow-hidden text-gray-500", "duration-300")}
              style={{ height: open ? collapsedHeight : 0 }}
            >
              {rest.map(({ costumeName, value }) => (
                <Bar key={costumeName} costumeName={costumeName} value={value} limit={limit} />
              ))}
            </div>
            <div className="text-right group-data-open:hidden">
              <button className="mt-2 py-1 text-nadeshiko-800" onClick={() => setOpen(true)}>
                すべてを表示
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface BarProps {
  costumeName: string;
  value: number;
  limit: number;
}

const Bar: React.FC<BarProps> = (props: BarProps) => {
  const { costumeName, value, limit } = props;

  return (
    <div key={costumeName} className="group rounded">
      <div className="flex w-full items-center gap-2 text-sm leading-4.5">
        <div className="min-w-0 flex-auto space-y-0.5">
          <p className="flex justify-between text-gray-500">
            <span className="line-clamp-1">{costumeName}</span>
            <span className="font-semibold text-nadeshiko-800">{value}</span>
          </p>
          <div className="h-3 overflow-hidden rounded-xs bg-gray-100">
            <div
              className="h-full rounded-xs bg-nadeshiko-800"
              style={{ width: `${(value / limit) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
