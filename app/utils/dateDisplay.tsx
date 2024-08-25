export const displayMonth = (year: number, month: number): string => {
  return `${year}年${month.toString().padStart(2, "0")}月`;
};
