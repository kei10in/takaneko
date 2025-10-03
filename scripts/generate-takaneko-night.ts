/**
 * Generate "たかねこナイト" radio event MDX files for a specified month.
 *
 * Usage:
 *   pnpm tsx scripts/generate-takaneko-night.ts 2025-11
 */

import Handlebars from "handlebars";
import fs from "node:fs";
import path from "path";
import { NaiveDate } from "~/utils/datetime/NaiveDate";

// Constants derived from the template & spec
const PROGRAM_FILE_SUFFIX = "TOKYO FM「たかねこナイト」.mdx";
const TEMPLATE_PATH = path.join(
  process.cwd(),
  "app",
  "features",
  "events",
  "_たかねこナイト-template.mdx",
);

interface ReplacementVars {
  broadcastDate: string;
  updatedAt: string;
  radikoTimestamp: string;
}

class Template {
  template: Handlebars.TemplateDelegate;

  constructor() {
    const c = fs.readFileSync(TEMPLATE_PATH, "utf8");
    this.template = Handlebars.compile(c);
  }

  render(vars: ReplacementVars): string {
    return this.template(vars);
  }
}

interface Parameters {
  outputFilePath: string;
  vars: ReplacementVars;
}

const generateParameters = (date: NaiveDate): Parameters => {
  const outputFilePath = path.join(
    "app",
    "features",
    "events",
    String(date.year),
    String(date.month).padStart(2, "0"),
    `${date.toString()}_${PROGRAM_FILE_SUFFIX}`,
  );
  const broadcastDate = date.toString();
  const updatedAt = NaiveDate.today().toString();
  const radikoTimestamp = `${date.addDays(1).toString().replace(/-/g, "")}030000`;

  return { outputFilePath, vars: { broadcastDate, updatedAt, radikoTimestamp } };
};

async function main() {
  const arg = process.argv[2];
  if (!arg || !/^\d{4}-\d{2}$/.test(arg)) {
    console.error("Usage: tsx scripts/generate-takaneko-night.ts YYYY-MM");
    process.exit(1);
  }

  const [yearStr, monthStr] = arg.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr); // 1-12
  if (month < 1 || month > 12) {
    console.error("Invalid month.");
    process.exit(1);
  }

  const template = new Template();

  enumerateTuesdays(year, month).forEach((date) => {
    const { outputFilePath, vars } = generateParameters(date);
    const content = template.render(vars);
    fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
    fs.writeFileSync(outputFilePath, content, "utf8");
  });
}

function enumerateTuesdays(year: number, month: number): NaiveDate[] {
  const dates: NaiveDate[] = [];

  let current = firstTuesdayOfMonth(year, month);
  while (current.month === month) {
    dates.push(current);
    current = current.addDays(7);
  }

  return dates;
}

const firstTuesdayOfMonth = (year: number, month: number): NaiveDate => {
  let d = new NaiveDate(year, month, 1);
  while (d.dayOfWeek !== 2) {
    d = d.nextDate();
  }
  return d;
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
