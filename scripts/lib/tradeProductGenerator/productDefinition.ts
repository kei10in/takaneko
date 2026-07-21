import path from "node:path";
import { format } from "prettier";
import { Project, SyntaxKind } from "ts-morph";
import type { ImagePosition } from "~/features/products/product";
import { Err, Ok, type Result } from "~/utils/result";

export type TradeProductType =
  | "photo-original"
  | "photo-grid"
  | "mini-photo-original"
  | "mini-photo-grid";
export type TradeProductLineup = "regular-27" | "regular-30";

export interface TradeProductInput {
  inputPath: string;
  type: TradeProductType;
  date: string;
  series: string;
  lineup: TradeProductLineup;
}

export interface TradeProductDescriptor extends TradeProductInput {
  year: number;
  itemCount: 27 | 30;
  exportName: string;
  productLabel: string;
  productName: string;
  categoryLabel: "生写真" | "ミニフォトカード";
  productLine: "Photo" | "MiniPhotoCard";
  lineupConstant:
    | "REGULAR_PHOTO_SET"
    | "REGULAR_PHOTO_SET2"
    | "REGULAR_MINI_PHOTO_SET"
    | "REGULAR_MINI_PHOTO_SET2";
  stem: string;
}

export interface GeneratedTradeProductImage {
  extension: ".jpg" | ".jpeg" | ".png" | ".webp";
  width: number;
  height: number;
  positions: ImagePosition[];
  buffer: Buffer;
}

export type TradeProductDescriptorError =
  | { kind: "invalid-date"; message: string }
  | { kind: "empty-series"; message: string }
  | { kind: "invalid-series"; message: string }
  | { kind: "invalid-export-name"; message: string };

const productTypeAttributes = {
  "photo-original": {
    categoryLabel: "生写真",
    productLine: "Photo",
    exportSuffix: "生写真",
    productNamePrefix: "生写真セット",
    lineups: {
      "regular-27": "REGULAR_PHOTO_SET2",
      "regular-30": "REGULAR_PHOTO_SET",
    },
  },
  "photo-grid": {
    categoryLabel: "生写真",
    productLine: "Photo",
    exportSuffix: "生写真",
    productNamePrefix: "生写真セット",
    lineups: {
      "regular-27": "REGULAR_PHOTO_SET2",
      "regular-30": "REGULAR_PHOTO_SET",
    },
  },
  "mini-photo-original": {
    categoryLabel: "ミニフォトカード",
    productLine: "MiniPhotoCard",
    exportSuffix: "ミニフォト",
    productNamePrefix: "ミニフォトカードセット",
    lineups: {
      "regular-27": "REGULAR_MINI_PHOTO_SET2",
      "regular-30": "REGULAR_MINI_PHOTO_SET",
    },
  },
  "mini-photo-grid": {
    categoryLabel: "ミニフォトカード",
    productLine: "MiniPhotoCard",
    exportSuffix: "ミニフォト",
    productNamePrefix: "ミニフォトカードセット",
    lineups: {
      "regular-27": "REGULAR_MINI_PHOTO_SET2",
      "regular-30": "REGULAR_MINI_PHOTO_SET",
    },
  },
} as const;

export const buildProductDescriptor = (
  input: TradeProductInput,
): Result<TradeProductDescriptor, TradeProductDescriptorError> => {
  const year = validDateYear(input.date);
  if (year == undefined) {
    return Err({ kind: "invalid-date", message: `日付が不正です: ${input.date}` });
  }

  const series = input.series.trim();
  if (series === "") {
    return Err({ kind: "empty-series", message: "シリーズ名を入力してください。" });
  }
  if (
    [...series].some((character) => {
      const codePoint = character.codePointAt(0);
      return character === "/" || character === "\\" || (codePoint != undefined && codePoint < 32);
    })
  ) {
    return Err({
      kind: "invalid-series",
      message: "シリーズ名にパス区切り文字または制御文字は使用できません。",
    });
  }

  const attributes = productTypeAttributes[input.type];
  const exportBase = sanitizeIdentifier(series);
  if (exportBase === "") {
    return Err({
      kind: "invalid-export-name",
      message: `シリーズ名から有効なexport名を生成できません: ${series}`,
    });
  }

  const productLabel = `${attributes.categoryLabel}「${series}」`;
  return Ok({
    ...input,
    series,
    year,
    itemCount: input.lineup === "regular-27" ? 27 : 30,
    exportName: `${exportBase}_${attributes.exportSuffix}`,
    productLabel,
    productName: `${attributes.productNamePrefix}「${series}」`,
    categoryLabel: attributes.categoryLabel,
    productLine: attributes.productLine,
    lineupConstant: attributes.lineups[input.lineup],
    stem: `${input.date}_${productLabel}`,
  });
};

export const productTypeUsesOriginalImage = (type: TradeProductType): boolean =>
  type === "photo-original" || type === "mini-photo-original";

export const productTypeIsPhoto = (type: TradeProductType): boolean =>
  type === "photo-original" || type === "photo-grid";

const validDateYear = (value: string): number | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match == undefined) return undefined;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? year
    : undefined;
};

const sanitizeIdentifier = (value: string): string => {
  const body = [...value.normalize("NFKC")]
    .filter((character) => /[$_\p{ID_Continue}]/u.test(character))
    .join("");
  if (body === "") return "";
  return /[$_\p{ID_Start}]/u.test(body[0]) ? body : `_${body}`;
};

export const renderProductDefinition = async (
  descriptor: TradeProductDescriptor,
  image: GeneratedTradeProductImage,
): Promise<string> => {
  const positions = image.positions
    .map(
      ({ id, x, y, width, height }) =>
        `    { id: ${id}, x: ${x}, y: ${y}, width: ${width}, height: ${height} },`,
    )
    .join("\n");
  const source = `import { ProductLine, RandomGoods, TradeTextType } from "~/features/products/product";
import { ${descriptor.lineupConstant} } from "../utils";

export const ${descriptor.exportName}: RandomGoods = {
  id: ${JSON.stringify(descriptor.productLabel)},
  slug: ${JSON.stringify(descriptor.productLabel)},
  name: ${JSON.stringify(descriptor.productName)},
  year: ${descriptor.year},
  series: ${JSON.stringify(descriptor.series)},
  category: ${JSON.stringify(descriptor.categoryLabel)},
  set: { kind: ProductLine.${descriptor.productLine}, setName: ${JSON.stringify(descriptor.series)} },
  tradeText: TradeTextType.Numbering,
  url: ${JSON.stringify(`/takaneko/goods/${descriptor.year}/${descriptor.stem}${image.extension}`)},
  width: ${image.width},
  height: ${image.height},
  variants: ${descriptor.lineupConstant},
  positions: [
${positions}
  ],
};
`;
  return format(source, { parser: "typescript", printWidth: 100 });
};

export interface ProductRegistration {
  exportName: string;
  importPath: string;
}

export const updateProductImagesSource = async (
  source: string,
  registration: ProductRegistration,
): Promise<string> => {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("productImages.ts", source);
  const imports = sourceFile.getImportDeclarations();
  const registeredImport = imports.find(
    (declaration) => declaration.getModuleSpecifierValue() === registration.importPath,
  );
  if (registeredImport == undefined) {
    sourceFile.insertImportDeclaration(imports.length, {
      namedImports: [registration.exportName],
      moduleSpecifier: registration.importPath,
    });
  } else if (
    !registeredImport
      .getNamedImports()
      .some((namedImport) => namedImport.getName() === registration.exportName)
  ) {
    registeredImport.addNamedImport(registration.exportName);
  }

  const photos = sourceFile
    .getVariableDeclarationOrThrow("TAKANEKO_PHOTOS")
    .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  if (!photos.getElements().some((element) => element.getText() === registration.exportName)) {
    photos.insertElement(0, registration.exportName);
  }

  return format(sourceFile.getFullText(), {
    parser: "typescript",
    printWidth: 100,
  });
};

export const updateReleaseNotes = (
  source: string,
  releaseDate: string,
  productLabel: string,
): string => {
  const bullet = `- トレード画像をつくるやつに、${productLabel}を追加しました。`;
  if (source.includes(bullet)) return source;

  const heading = `## ${releaseDate}`;
  const headingIndex = source.indexOf(heading);
  if (headingIndex >= 0) {
    const insertion = headingIndex + heading.length;
    return `${source.slice(0, insertion)}\n\n${bullet}${source.slice(insertion + 1)}`;
  }

  const titleEnd = source.indexOf("\n", source.indexOf("# "));
  const insertion = titleEnd >= 0 ? titleEnd + 1 : 0;
  return `${source.slice(0, insertion)}\n${heading}\n\n${bullet}\n${source.slice(insertion)}`;
};

export const productDefinitionPath = (
  repositoryRoot: string,
  descriptor: TradeProductDescriptor,
): string =>
  path.join(
    repositoryRoot,
    "app/features/products",
    String(descriptor.year),
    `${descriptor.stem}.ts`,
  );

export const productImagePath = (
  repositoryRoot: string,
  descriptor: TradeProductDescriptor,
  extension: GeneratedTradeProductImage["extension"],
): string =>
  path.join(
    repositoryRoot,
    "public/takaneko/goods",
    String(descriptor.year),
    `${descriptor.stem}${extension}`,
  );
