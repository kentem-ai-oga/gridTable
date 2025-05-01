import { ReactNode } from "react";

/**
 * セルグリッドの構造を定義するインターフェース
 * 行と列の数、およびそれらの相対サイズを指定します
 */
export interface GridStructure {
  /** 行の数（区切り線を含まない） */
  rows: number;
  /** 列の数（区切り線を含まない） */
  columns: number;
  /** 行の高さの比率 (省略可、デフォルトは均等分割) */
  rowSizes?: string[];
  /** 列の幅の比率 (省略可、デフォルトは均等分割) */
  columnSizes?: string[];
  /** 区切り線のサイズ (px単位、省略可) */
  dividerSize?: number;
}

/**
 * グリッド内のセルの位置と範囲を定義するインターフェース
 */
export interface CellPosition {
  /** 開始行 (0ベース) */
  rowStart: number;
  /** 開始列 (0ベース) */
  columnStart: number;
  /** 行方向の範囲 */
  rowSpan?: number;
  /** 列方向の範囲 */
  columnSpan?: number;
}

/**
 * グリッド内のセル定義
 */
export interface CellDefinition extends CellPosition {
  /** セルの内容 */
  content: ReactNode;
  /** セル固有のクラス名 */
  className?: string;
}

/**
 * 区切り線の位置と方向を定義するインターフェース
 */
export interface Divider {
  /** 開始行 (0ベース) */
  rowStart: number;
  /** 開始列 (0ベース) */
  columnStart: number;
  /** 区切り線の方向 */
  direction: "horizontal" | "vertical";
  /** 区切り線の範囲 */
  span?: number;
  /** 区切り線固有のクラス名 */
  className?: string;
}

/**
 * グリッド内の区切り線の配置を生成します
 */
export const generateDividers = (structure: GridStructure): Divider[] => {
  const { rows, columns } = structure;
  const dividers: Divider[] = [];

  // 水平方向の区切り線
  for (let row = 1; row < rows; row++) {
    dividers.push({
      rowStart: row,
      columnStart: 0,
      direction: "horizontal",
      span: columns,
    });
  }

  // 垂直方向の区切り線
  for (let col = 1; col < columns; col++) {
    dividers.push({
      rowStart: 0,
      columnStart: col,
      direction: "vertical",
      span: rows,
    });
  }

  return dividers;
};

/**
 * GridStructureからTailwindのgrid-template-* クラスを生成
 */
export const generateGridTemplateClasses = (
  structure: GridStructure,
): string => {
  const { rows, columns, rowSizes, columnSizes, dividerSize = 1 } = structure;

  // 行のサイズ定義を作成
  let rowTemplate = rowSizes
    ? rowSizes.join("_")
    : Array(rows).fill("1fr").join("_");

  // 区切り線が必要な場合、行テンプレートに区切り線を挿入
  if (rows > 1) {
    rowTemplate = rowTemplate.replace(/_/g, `_${dividerSize}px_`);
  }

  // 列のサイズ定義を作成
  let colTemplate = columnSizes
    ? columnSizes.join("_")
    : Array(columns).fill("1fr").join("_");

  // 区切り線が必要な場合、列テンプレートに区切り線を挿入
  if (columns > 1) {
    colTemplate = colTemplate.replace(/_/g, `_${dividerSize}px_`);
  }

  return `grid-rows-[${rowTemplate}] grid-cols-[${colTemplate}]`;
};

/**
 * CellPositionからTailwindの配置クラスを生成
 */
export const generateCellPositionClasses = (position: CellPosition): string => {
  const { rowStart, columnStart, rowSpan = 1, columnSpan = 1 } = position;

  // 区切り線を考慮した実際のグリッド位置を計算
  const actualRowStart = rowStart * 2 + 1;
  const actualColStart = columnStart * 2 + 1;

  // 区切り線を考慮した実際のスパンを計算
  const actualRowSpan = rowSpan * 2 - 1;
  const actualColSpan = columnSpan * 2 - 1;

  return `row-start-${actualRowStart} col-start-${actualColStart} ${
    rowSpan > 1 ? `row-span-${actualRowSpan}` : ""
  } ${columnSpan > 1 ? `col-span-${actualColSpan}` : ""}`;
};

/**
 * 区切り線のTailwindクラスを生成
 */
export const generateDividerClasses = (divider: Divider): string => {
  const { rowStart, columnStart, direction, span = 1 } = divider;
  // 区切り線を考慮した実際のグリッド位置を計算
  const actualRowStart =
    direction === "horizontal" ? rowStart * 2 : rowStart * 2 + 1;

  const actualColStart =
    direction === "vertical" ? columnStart * 2 : columnStart * 2 + 1;

  // スパンを計算
  const spanClass =
    direction === "horizontal"
      ? span > 1
        ? `col-span-${span * 2 - 1}`
        : ""
      : span > 1
        ? `row-span-${span * 2 - 1}`
        : "";

  // 境界線と幅/高さのクラス
  const borderClass = direction === "horizontal" ? "border-b" : "border-r";

  return `row-start-${actualRowStart} col-start-${actualColStart} ${spanClass} ${borderClass} border-gray-300 w-full h-full`;
};

interface ComplexCellLayoutProps {
  /** グリッドの構造定義 */
  structure: GridStructure;
  /** セルの定義配列 */
  cells: CellDefinition[];
  /** カスタムDivider配列（省略時は自動生成） */
  customDividers?: Divider[];
  /** コンポーネントのルートに適用する追加クラス */
  className?: string;
}

/**
 * 複雑なセルレイアウトを簡潔に定義するためのコンポーネント
 */
export const ComplexCellLayout = ({
  structure,
  cells,
  customDividers,
  className = "",
}: ComplexCellLayoutProps) => {
  // グリッドテンプレートクラスを生成
  const gridTemplateClasses = generateGridTemplateClasses(structure);

  // 区切り線の配列を取得（カスタム指定またはデフォルト生成）
  const dividers = customDividers || generateDividers(structure);

  return (
    <div
      className={`grid ${gridTemplateClasses} place-items-center ${className}`}
    >
      {/* セルを描画 */}
      {cells.map((cell, index) => (
        <div
          key={`cell-${index}`}
          className={`${generateCellPositionClasses(cell)} ${cell.className || ""}`}
        >
          {cell.content}
        </div>
      ))}{" "}
      {/* 区切り線を描画 */}
      {dividers.map((divider, index) => (
        <div
          key={`divider-${index}`}
          className={`${generateDividerClasses(divider)} ${divider.className || ""}`}
        />
      ))}
    </div>
  );
};
