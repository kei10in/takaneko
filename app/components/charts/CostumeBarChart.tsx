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

  return (
    <div className="w-full space-y-2.5">
      {costume.map((item) => {
        const { value, costumeName } = item;

        return (
          <div key={costumeName} className="group rounded">
            <div className="flex w-full items-center gap-2 text-sm leading-tight">
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
      })}
    </div>
  );
};
