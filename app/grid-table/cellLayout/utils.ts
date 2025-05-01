import { CellDefinition, CellPosition, GridStructure } from ".";
import { CellLayout } from "../types";

/**
 * 既存のCellLayoutを新しいCellPosition形式に変換する
 *
 * @param layout - 変換するCellLayout（小数点座標系 0～1）
 * @param gridDivisions - グリッド分割数（デフォルト: 12）
 * @returns 整数ベースのCellPosition
 */
export const convertCellLayoutToPosition = (
  layout: CellLayout,
  gridDivisions: number = 12,
): CellPosition => {
  // CellLayoutはfractional coordinates (0～1)で定義されている
  // CellPositionは整数ベース (0, 1, 2...)で定義されているため変換が必要

  // グリッド分割数に基づいて正確に変換
  const rowStart = Math.round(layout.topRow * gridDivisions);
  const columnStart = Math.round(layout.leftColumn * gridDivisions);
  const rowEnd = Math.round(layout.bottomRow * gridDivisions);
  const columnEnd = Math.round(layout.rightColumn * gridDivisions);

  return {
    rowStart,
    columnStart,
    rowSpan: Math.max(1, rowEnd - rowStart), // 最小1セル保証
    columnSpan: Math.max(1, columnEnd - columnStart), // 最小1セル保証
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
