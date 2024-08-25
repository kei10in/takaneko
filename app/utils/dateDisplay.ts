import { NaiveDate } from "./datetime/NaiveDate";
import { NaiveMonth } from "./datetime/NaiveMonth";

export function displayDate(nd: NaiveDate): string;
export function displayDate(year: number, month: number, day: number): string;

export function displayDate(yearOrNd: number | NaiveDate, month?: number, day?: number): string {
  if (typeof yearOrNd === "number" && typeof month === "number" && typeof day === "number") {
    return displayDate(new NaiveDate(yearOrNd, month, day));
  } else if (yearOrNd instanceof NaiveDate) {
    return `${yearOrNd.year}年${yearOrNd.month.toString().padStart(2, "0")}月${yearOrNd.day.toString().padStart(2, "0")}日`;
  } else {
    throw new Error("Invalid arguments");
  }
}

export function displayMonth(nm: NaiveMonth): string;
export function displayMonth(year: number, month: number): string;

export function displayMonth(yearOrNm: number | NaiveMonth, month?: number): string {
  if (typeof yearOrNm === "number" && typeof month === "number") {
    return displayMonth(new NaiveMonth(yearOrNm, month));
  } else if (yearOrNm instanceof NaiveMonth) {
    return `${yearOrNm.year}年${yearOrNm.month.toString().padStart(2, "0")}月`;
  } else {
    throw new Error("Invalid arguments");
  }
}
