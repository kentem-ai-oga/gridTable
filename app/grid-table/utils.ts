// GridTableで利用するユーティリティ関数

import { CellLayout } from "./types";

/**
 * セル分割パターンを定義するオプション
 */
export type SplitOptions = {
  /** 分割方向 (horizontal: 左右分割, vertical: 上下分割) */
  direction: "horizontal" | "vertical";
  /** 分割数 */
  count: number;
};

/**
 * グリッド作成オプション
 */
export type GridOptions = {
  /** 行数 */
  rows: number;
  /** 列数 */
  columns: number;
};

/**
 * セル分割を作成する関数
 * 単一のセルを指定された方向と数に分割する
 *
 * @param options 分割オプション
 * @returns 分割されたセルレイアウトの配列
 */
export const createCellSplit = (options: SplitOptions): CellLayout[] => {
  const { direction, count } = options;

  if (count <= 0) {
    throw new Error("分割数は1以上である必要があります");
  }

  const cells: CellLayout[] = [];
  const step = 1 / count;

  for (let i = 0; i < count; i++) {
    const cell: CellLayout = {
      topRow: direction === "vertical" ? i * step : 0,
      leftColumn: direction === "horizontal" ? i * step : 0,
      bottomRow: direction === "vertical" ? (i + 1) * step : 1,
      rightColumn: direction === "horizontal" ? (i + 1) * step : 1,
    };
    cells.push(cell);
  }

  return cells;
};

/**
 * グリッドセルを作成する関数
 * 行と列を指定して格子状のセルレイアウトを作成する
 *
 * @param options グリッドオプション
 * @returns グリッドセルレイアウトの配列
 */
export const createCellGrid = (options: GridOptions): CellLayout[] => {
  const { rows, columns } = options;

  if (rows <= 0 || columns <= 0) {
    throw new Error("行数と列数は1以上である必要があります");
  }

  const cells: CellLayout[] = [];
  const rowStep = 1 / rows;
  const columnStep = 1 / columns;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell: CellLayout = {
        topRow: r * rowStep,
        leftColumn: c * columnStep,
        bottomRow: (r + 1) * rowStep,
        rightColumn: (c + 1) * columnStep,
      };
      cells.push(cell);
    }
  }

  return cells;
};
