export interface ChartStack {
  label: string;
  color: string;
}

export interface ChartRow {
  label: string;
  /** undefined は未集計。集計済みなら stacks と同じ長さ・順序で値を渡し、0件は0とする。 */
  values: number[] | undefined;
}

export const sumChartValues = (values: ChartRow["values"]): number | undefined =>
  values?.reduce((sum, value) => sum + value, 0);
