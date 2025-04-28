// GridTableで利用するユーティリティ関数

import { CellLayout } from "./types";

/**
 * セル分割パターンを定義するユーティリティ関数
 *
 * @example
 * ```tsx
 * // 上下に分割された2つのセル
 * const [topCell, bottomCell] = createCellSplit({
 *   direction: "vertical", // 垂直方向の分割
 *   count: 2               // 2分割
 * });
 *
 * // 左右に3分割されたセル
 * const [leftCell, middleCell, rightCell] = createCellSplit({
 *   direction: "horizontal", // 水平方向の分割
 *   count: 3                 // 3分割
 * });
 *
 * // 複雑な分割パターン (3x2グリッド)
 * const cells = createCellGrid({
 *   rows: 3,    // 3行
 *   columns: 2  // 2列
 * });
 * ```
 */

/**
 * 分割方向
 */
type SplitDirection = "horizontal" | "vertical";

/**
 * セル分割オプション
 */
interface SplitOptions {
  /**
   * 分割方向
   * - horizontal: 水平方向の分割（左右に分かれる）
   * - vertical: 垂直方向の分割（上下に分かれる）
   */
  direction: SplitDirection;
  /**
   * 分割数
   */
  count: number;
}

/**
 * グリッドオプション
 */
interface GridOptions {
  /**
   * 行数
   */
  rows: number;
  /**
   * 列数
   */
  columns: number;
}

/**
 * セル分割を作成する関数
 * 単一のセルを指定された方向と数に分割する
 *
 * @param options 分割オプション
 * @returns 分割されたセルレイアウトの配列
 */
export function createCellSplit(options: SplitOptions): CellLayout[] {
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
}

/**
 * グリッドセルを作成する関数
 * 行と列を指定して格子状のセルレイアウトを作成する
 *
 * @param options グリッドオプション
 * @returns グリッドセルレイアウトの配列
 */
export function createCellGrid(options: GridOptions): CellLayout[] {
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
}

/**
 * 特定のセルレイアウトに基づいてCSSクラスを生成する関数
 * この関数はTailwind CSSを使用している場合に便利
 *
 * @param cellLayout セルレイアウト
 * @param baseClassName 基本となるクラス名
 * @returns CSSクラス文字列
 */
export function generateCellClassName(
  cellLayout: CellLayout,
  baseClassName: string = "",
): string {
  // セルの位置に基づくCSS Gridの位置クラスを生成
  const positionClasses = `
    row-start-[${Math.floor(cellLayout.topRow * 12) + 1}] 
    col-start-[${Math.floor(cellLayout.leftColumn * 12) + 1}]
    row-end-[${Math.floor(cellLayout.bottomRow * 12) + 1}]
    col-end-[${Math.floor(cellLayout.rightColumn * 12) + 1}]
  `;

  return `${baseClassName} ${positionClasses}`.trim();
}

/**
 * 分割セルのコンテナを作成するためのCSSクラスを生成する関数
 *
 * @param cellCount 分割するセルの数
 * @param baseClassName 基本となるクラス名
 * @returns CSSクラス文字列
 */
export function generateCellContainerClassName(
  rowCount: number,
  columnCount: number,
  baseClassName: string = "",
): string {
  // グリッドコンテナのクラスを生成
  const gridClasses = `
    grid
    grid-rows-${rowCount * 4} 
    grid-cols-${columnCount * 4}
  `;

  return `${baseClassName} ${gridClasses}`.trim();
}
