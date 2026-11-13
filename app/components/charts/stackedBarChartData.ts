export interface ChartStack {
  /** 省略すると、値を持たない仮想スタックとして扱う。 */
  label?: string;
  color: string;
}

export interface ChartRow {
  label: string;
  /** undefined は未集計。値は仮想スタックを除いた stacks と同じ長さ・順序で渡す。 */
  values: number[] | undefined;
}

export const fillVirtualStackValues = (
  values: ChartRow["values"],
  stacks: ChartStack[],
): ChartRow["values"] => {
  if (values == undefined) {
    return undefined;
  }
  let valueIndex = 0;
  return stacks.map((stack) => (stack.label == undefined ? 0 : values[valueIndex++]));
};

export const sumChartValues = (values: ChartRow["values"]): number | undefined =>
  values?.reduce((sum, value) => sum + value, 0);
