// 型定義を集約したファイル

/**
 * セルの位置と大きさを表す基本構造
 * セルがどのような形状・分割になっているかだけを表す
 */
export interface CellLayout {
  /** セルの上端行 */
  topRow: number;
  /** セルの左端列 */
  leftColumn: number;
  /** セルの下端行 */
  bottomRow: number;
  /** セルの右端列 */
  rightColumn: number;
}

/**
 * UIからのフォーカス制御を含めたセル情報
 */
export interface Cell extends CellLayout {
  /** セルにフォーカスを当てる関数 */
  focus: () => void;
}

/**
 * セルが分割されていない標準的なセルレイアウト
 */
export const STANDARD_CELL_LAYOUT: CellLayout = {
  topRow: 0,
  leftColumn: 0,
  bottomRow: 1,
  rightColumn: 1,
} as const;

/**
 * データがどのようなプロパティを持っているかの制約
 * 数値、文字列、日付、オブジェクトをサポート
 */
export type DataType =
  | string
  | number
  | Date
  | Record<
      string,
      string | number | Date | Record<string, string | number | Date>
    >;

/**
 * テーブルの行データの基本型
 */
export type RowData = Record<string, DataType>;

/**
 * キー移動の方向
 */
export type MoveDirection = "up" | "down" | "left" | "right";

/**
 * セルの共通インターフェース
 * どのようなセルコンポーネントでも実装する必要がある基本的な機能
 */
export interface CellComponentProps<T = DataType> {
  value: T;
  onChange?: (newValue: T) => void;
  onFocus?: () => void;
  onKeyDown?: (key: MoveDirection) => void;
  className?: string;
}

/**
 * セルコンポーネントで外部に提供すべき機能
 */
export interface CellComponentRef {
  focus: () => void;
}

/**
 * セルの初期化時に必要な情報
 */
export interface CellInitializeProps {
  rowIndex: number;
  columnIndex: number;
  accessorKey: string;
  onCellInitialize: (cell: Cell) => void;
  onCellFocus: (cellLayout: CellLayout) => void;
}
