import { CellLayout } from "../types";
import {
  CellDefinition,
  CellPosition,
  GridStructure,
} from "./ComplexCellLayout";

/**
 * 既存のCellLayoutを新しいCellPosition形式に変換する
 */
export const convertCellLayoutToPosition = (
  layout: CellLayout,
): CellPosition => {
  // CellLayoutはfractional coordinates (0～1)で定義されている
  // CellPositionは整数ベース (0, 1, 2...)で定義されているため変換が必要

  // 注: この関数は簡略化された変換で、実際の使用には正規化が必要な場合があります
  return {
    rowStart: Math.floor(layout.topRow * 100),
    columnStart: Math.floor(layout.leftColumn * 100),
    rowSpan: Math.ceil((layout.bottomRow - layout.topRow) * 100),
    columnSpan: Math.ceil((layout.rightColumn - layout.leftColumn) * 100),
  };
};

/**
 * CellLayoutの配列から最適なGridStructureを推定する
 */
export const inferGridStructure = (layouts: CellLayout[]): GridStructure => {
  if (layouts.length === 0) {
    return { rows: 1, columns: 1 };
  }

  // すべてのセルの位置を分析して行数と列数を推定
  let maxRow = 0;
  let maxColumn = 0;

  layouts.forEach((layout) => {
    const rowEnd = Math.ceil(layout.bottomRow * 100);
    const colEnd = Math.ceil(layout.rightColumn * 100);

    maxRow = Math.max(maxRow, rowEnd);
    maxColumn = Math.max(maxColumn, colEnd);
  });

  return {
    rows: maxRow,
    columns: maxColumn,
  };
};

/**
 * 2x2や3x3などのシンプルな数値のグリッド定義から GridStructure を生成
 *
 * @param rows 行数
 * @param columns 列数
 * @param options 追加オプション
 */
export const createGridStructure = (
  rows: number,
  columns: number,
  options?: Partial<Omit<GridStructure, "rows" | "columns">>,
): GridStructure => {
  return {
    rows,
    columns,
    ...options,
  };
};

/**
 * セル定義を位置指定付きで作成するヘルパー関数
 */
export const createCellDefinition = (
  rowStart: number,
  columnStart: number,
  content: React.ReactNode,
  options?: Partial<
    Omit<CellDefinition, "rowStart" | "columnStart" | "content">
  >,
): CellDefinition => {
  return {
    rowStart,
    columnStart,
    content,
    ...options,
  };
};
