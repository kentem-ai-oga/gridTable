"use client";

import { ReactElement, ReactNode, useCallback, useRef } from "react";
import { Cell, CellLayout, MoveDirection, RowData, StringKeyOf } from "./types";

/**
 * カラム定義の型
 * T: 行データの型
 */
export type Column<T extends RowData> = {
  accessorKey: StringKeyOf<T>;
  header: (props: {
    columnAccessorKey: StringKeyOf<T>;
    callbackFn?: (value: unknown) => void;
  }) => ReactNode;
  cell: (props: {
    rowIndex: number;
    columnAccessorKey: StringKeyOf<T>;
    value: T[StringKeyOf<T>];
    onChange?: (value: T[StringKeyOf<T>]) => void;
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
    columnAccessorKey: StringKeyOf<T>;
    rowIndex: number;
    value: T[StringKeyOf<T>];
  }) => void;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  headerCellClassName?: string;
};

/**
 * GridTableコンポーネント
 * Excelのようなセル移動と編集が可能なテーブルコンポーネント
 */
const GridTable = <T extends RowData>({
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
}: GridTableProps<T>): ReactElement => {
  // フォーカス可能なすべてのセルを格納するref
  const cellsRef = useRef<Cell[]>([]);

  // 現在フォーカスされているセルのref
  const focusedCellRef = useRef<Cell | null>(null);

  /**
   * セルをセルリストに追加する
   */
  const registerCell = useCallback((cell: Cell) => {
    // 重複チェック
    const exists = cellsRef.current.some(
      (existingCell) =>
        existingCell.topRow === cell.topRow &&
        existingCell.leftColumn === cell.leftColumn &&
        existingCell.bottomRow === cell.bottomRow &&
        existingCell.rightColumn === cell.rightColumn,
    );
    if (!exists) {
      cellsRef.current.push(cell);
    }
  }, []);

  /**
   * 特定のセルにフォーカスが当たった際に、内部状態を更新する
   */
  const focusCell = useCallback((cellToFocus: CellLayout) => {
    const targetCell = cellsRef.current.find((cell) => {
      // 浮動小数点数の比較には許容誤差を設ける
      const tolerance = 0.001;
      return (
        Math.abs(cell.topRow - cellToFocus.topRow) < tolerance &&
        Math.abs(cell.leftColumn - cellToFocus.leftColumn) < tolerance &&
        Math.abs(cell.bottomRow - cellToFocus.bottomRow) < tolerance &&
        Math.abs(cell.rightColumn - cellToFocus.rightColumn) < tolerance
      );
    });

    if (targetCell) {
      // フォーカスされたセルの参照を更新
      focusedCellRef.current = targetCell;
    }
  }, []);

  /**
   * 指定した方向に移動し、次のセルにフォーカスする
   */
  const moveToCell = useCallback((direction: MoveDirection) => {
    if (!focusedCellRef.current) {
      return;
    }
    const currentCell = focusedCellRef.current;
    // 現在のセルの中心座標を計算
    const currentMiddleRow = (currentCell.topRow + currentCell.bottomRow) / 2;
    const currentMiddleColumn =
      (currentCell.leftColumn + currentCell.rightColumn) / 2;

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

      return isMatch;
    });

    if (nextCell) {
      // フォーカス移動
      focusedCellRef.current = nextCell;
      nextCell.focus();
    }
  }, []);

  return (
    <div className={className}>
      <table className={tableClassName}>
        <thead className={headerClassName}>
          <tr className={rowClassName}>
            {columns.map((column, index) => (
              <th
                key={`${String(column.accessorKey)}-${index}`} // より安全なキー
                className={headerCellClassName}
              >
                {/* column.headerが関数なら実行、そうでなければそのまま表示 */}
                {typeof column.header === "function"
                  ? column.header({ columnAccessorKey: column.accessorKey })
                  : column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowClassName}>
              {columns.map((column, columnIndex) => (
                <td
                  key={`${String(column.accessorKey)}-${columnIndex}`} // より安全なキー
                  className={cellClassName}
                >
                  {/* column.cellが関数なら実行 */}
                  {typeof column.cell === "function" &&
                    column.cell({
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
                        // テーブル全体での絶対座標に変換して focusCell を呼ぶ
                        const absoluteLayout = {
                          topRow: rowIndex + cellLayout.topRow,
                          leftColumn: columnIndex + cellLayout.leftColumn,
                          bottomRow: rowIndex + cellLayout.bottomRow,
                          rightColumn: columnIndex + cellLayout.rightColumn,
                        };
                        focusCell(absoluteLayout);
                      },
                      onKeyDown: moveToCell,
                      onInitialize: (subCells) => {
                        // テーブル全体での絶対座標に変換して registerCell を呼ぶ
                        subCells.forEach((subCell) => {
                          // subCellにfocusメソッドがあることを確認
                          if (typeof subCell.focus === "function") {
                            registerCell({
                              topRow: rowIndex + subCell.topRow,
                              leftColumn: columnIndex + subCell.leftColumn,
                              bottomRow: rowIndex + subCell.bottomRow,
                              rightColumn: columnIndex + subCell.rightColumn,
                              focus: subCell.focus,
                            });
                          } else {
                            console.warn(
                              "Cell registered without a focus method:",
                              subCell,
                            );
                            // focusがない場合の代替処理 (例: 何もしない関数を登録)
                            registerCell({
                              topRow: rowIndex + subCell.topRow,
                              leftColumn: columnIndex + subCell.leftColumn,
                              bottomRow: rowIndex + subCell.bottomRow,
                              rightColumn: columnIndex + subCell.rightColumn,
                              focus: () => {},
                            });
                          }
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
};

export default GridTable;
