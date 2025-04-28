// GridTable本体

import { ReactNode, useCallback, useRef } from "react";
import { Cell, CellLayout, MoveDirection, RowData } from "./types";

/**
 * カラム定義の型
 * T: 行データの型
 */
export type Column<T extends RowData> = {
  /** データのキー */
  accessorKey: keyof T & string;
  /** ヘッダーのレンダリング関数 */
  header: (props: {
    columnAccessorKey: keyof T & string;
    callbackFn?: (value: unknown) => void;
  }) => ReactNode;
  /** セルのレンダリング関数 */
  cell: (props: {
    rowIndex: number;
    columnAccessorKey: keyof T & string;
    value: T[keyof T];
    onChange?: (value: T[keyof T]) => void;
    onFocus?: (cellLayout: CellLayout) => void;
    onInitialize?: (subCells: Cell[]) => void;
    onKeyDown?: (direction: MoveDirection) => void;
  }) => ReactNode;
};

/**
 * GridTableのプロパティ
 * T: 行データの型
 */
export type GridTableProps<T extends RowData> = {
  columns: Column<T>[];
  data: T[];
  onChange: (params: {
    columnAccessorKey: keyof T & string;
    rowIndex: number;
    value: T[keyof T];
  }) => void;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  headerCellClassName?: string;
  title?: string;
};

/**
 * GridTableコンポーネント
 * Excelのようなセル移動と編集が可能なテーブルコンポーネント
 */
export default function GridTable<T extends RowData>({
  columns,
  data,
  onChange,
  className = "",
  tableClassName = "table-auto border-collapse border border-gray-300",
  headerClassName = "bg-gray-200",
  bodyClassName = "bg-white",
  rowClassName = "border-b border-gray-300 h-full",
  cellClassName = "border border-gray-300 h-full",
  headerCellClassName = "border border-gray-300 h-full",
  title = "Grid Table",
}: GridTableProps<T>) {
  // フォーカス可能なすべてのセルを格納するref
  const cellsRef = useRef<Cell[]>([]);

  // 現在フォーカスされているセルのref
  const focusedCellRef = useRef<Cell | null>(null);

  /**
   * セルをセルリストに追加する
   */
  const registerCell = useCallback((cell: Cell) => {
    cellsRef.current.push(cell);
  }, []);
  /**
   * 特定のセルにフォーカスを当てる
   */
  const focusCell = useCallback((cellToFocus: CellLayout) => {
    const targetCell = cellsRef.current.find((cell) => {
      return (
        cell.topRow === cellToFocus.topRow &&
        cell.leftColumn === cellToFocus.leftColumn &&
        cell.bottomRow === cellToFocus.bottomRow &&
        cell.rightColumn === cellToFocus.rightColumn
      );
    });

    if (targetCell) {
      // フォーカスされたセルの参照を更新
      focusedCellRef.current = targetCell;
      // console.log("フォーカスセル更新:", targetCell); // デバッグ用
    }
  }, []);
  /**
   * 指定した方向に移動する
   */
  const moveToCell = useCallback((direction: MoveDirection) => {
    if (!focusedCellRef.current) {
      //console.log("移動元セルがありません", direction); // デバッグ用
      return;
    }

    const currentCell = focusedCellRef.current;
    // 現在のセルの中心座標を計算
    const currentMiddleRow = (currentCell.topRow + currentCell.bottomRow) / 2;
    const currentMiddleColumn =
      (currentCell.leftColumn + currentCell.rightColumn) / 2;

    // デバッグ情報
    //console.log("移動処理開始:", direction);
    //console.log("現在のセル:", currentCell);
    //console.log("セル総数:", cellsRef.current.length);

    // 移動方向に応じて次のセルを見つける
    const nextCell = cellsRef.current.find((cell) => {
      // 自分自身は除外
      if (
        cell.topRow === currentCell.topRow &&
        cell.leftColumn === currentCell.leftColumn &&
        cell.bottomRow === currentCell.bottomRow &&
        cell.rightColumn === currentCell.rightColumn
      ) {
        return false;
      }

      let isMatch = false;

      switch (direction) {
        case "up":
          // 上に移動: 現在のセル上端がターゲットセルの下端と一致/近接し、列が重なっていること
          isMatch =
            Math.abs(currentCell.topRow - cell.bottomRow) < 0.001 && // 浮動小数点誤差を許容
            currentMiddleColumn >= cell.leftColumn &&
            currentMiddleColumn < cell.rightColumn;
          break;
        case "down":
          // 下に移動: 現在のセル下端がターゲットセルの上端と一致/近接し、列が重なっていること
          isMatch =
            Math.abs(currentCell.bottomRow - cell.topRow) < 0.001 && // 浮動小数点誤差を許容
            currentMiddleColumn >= cell.leftColumn &&
            currentMiddleColumn < cell.rightColumn;
          break;
        case "left":
          // 左に移動: 現在のセル左端がターゲットセルの右端と一致/近接し、行が重なっていること
          isMatch =
            Math.abs(currentCell.leftColumn - cell.rightColumn) < 0.001 && // 浮動小数点誤差を許容
            currentMiddleRow > cell.topRow &&
            currentMiddleRow <= cell.bottomRow;
          break;
        case "right":
          // 右に移動: 現在のセル右端がターゲットセルの左端と一致/近接し、行が重なっていること
          isMatch =
            Math.abs(currentCell.rightColumn - cell.leftColumn) < 0.001 && // 浮動小数点誤差を許容
            currentMiddleRow > cell.topRow &&
            currentMiddleRow <= cell.bottomRow;
          break;
      }

      /*if (isMatch) {
        console.log("次のセル見つかりました:", cell);
      }*/

      return isMatch;
    });

    if (nextCell) {
      //console.log("移動先セル:", nextCell);
      // フォーカス移動
      focusedCellRef.current = nextCell;
      nextCell.focus();
    } else {
      //console.log("移動先のセルが見つかりません", direction);
    }
  }, []);

  return (
    <div className={className}>
      {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
      <table className={tableClassName}>
        <thead className={headerClassName}>
          <tr className={rowClassName}>
            {columns.map((column) => (
              <th
                key={String(column.accessorKey)}
                className={headerCellClassName}
              >
                {column.header({
                  columnAccessorKey: column.accessorKey,
                })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowClassName}>
              {columns.map((column, columnIndex) => (
                <td key={String(column.accessorKey)} className={cellClassName}>
                  {column.cell({
                    rowIndex,
                    columnAccessorKey: column.accessorKey,
                    value: row[column.accessorKey],
                    onChange: (value) =>
                      onChange({
                        columnAccessorKey: column.accessorKey,
                        rowIndex,
                        value,
                      }),
                    onFocus: (cellLayout) => {
                      focusCell({
                        topRow: rowIndex + cellLayout.topRow,
                        leftColumn: columnIndex + cellLayout.leftColumn,
                        bottomRow: rowIndex + cellLayout.bottomRow,
                        rightColumn: columnIndex + cellLayout.rightColumn,
                      });
                    },
                    onKeyDown: moveToCell,
                    onInitialize: (subCells) => {
                      subCells.forEach((subCell) => {
                        registerCell({
                          topRow: rowIndex + subCell.topRow,
                          leftColumn: columnIndex + subCell.leftColumn,
                          bottomRow: rowIndex + subCell.bottomRow,
                          rightColumn: columnIndex + subCell.rightColumn,
                          focus: subCell.focus,
                        });
                      });
                    },
                  })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
