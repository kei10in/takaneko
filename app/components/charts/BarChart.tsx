import { calculateChartDimensions } from "./scale";

interface Props {
  data: { key: string; value: number }[];
}

export const BarChart: React.FC<Props> = ({ data }: Props) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  const { limit } = calculateChartDimensions(maxValue);

  return (
    <div className="w-full space-y-2">
      {data.map((item) => (
        <div key={item.key} className="w-full text-sm leading-tight">
          <p className="flex justify-between text-gray-500">
            <span>{item.key}</span>
            <span className="font-semibold text-nadeshiko-800">{item.value}</span>
          </p>
          <div className="h-3 overflow-hidden rounded-xs bg-gray-100">
            <div
              className="h-full rounded-xs bg-nadeshiko-800"
              style={{ width: `${(item.value / limit) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
