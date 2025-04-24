// GridTable本体

import { ReactNode, useRef } from "react";

// 1セルの中でセルが分割されないケースで使う
export const CELL_WITHOUT_SUBCELL = {
  topRow: 0,
  leftColumn: 0,
  bottomRow: 1,
  rightColumn: 1,
} as const satisfies Omit<Cell, "focus">;

export type Cell = {
  /** セルの上端行 */
  topRow: number;
  /** セルの左端列 */
  leftColumn: number;
  /** セルの下端行 */
  bottomRow: number;
  /** セルの右端列 */
  rightColumn: number;
  focus: () => void;
};

type ColumnType = Record<
  string | number,
  string | number | Date | Record<string | number, string | number | Date>
>;

type Column<T extends ColumnType> = {
  accessorKey: Exclude<keyof T, symbol>; // NOTE: `keyof T`には意図しないsymbolが含まれているため除外する
  header: ({
    columnAccessorKey,
    callbackFn,
  }: {
    columnAccessorKey: Exclude<keyof T, symbol>;
    callbackFn?: (value: unknown) => void;
  }) => ReactNode;
  cell: ({
    rowIndex,
    columnAccessorKey,
    value,
    onChange,
    onFocus,
    onInitialize,
    onKeyDown,
  }: {
    rowIndex: number;
    columnAccessorKey: Exclude<keyof T, symbol>;
    value: unknown;
    onChange?: (value: unknown) => void;
    onFocus?: (cell: Omit<Cell, "focus">) => void;
    onInitialize?: (subCells: Cell[]) => void;
    onKeyDown?: (key: "up" | "down" | "left" | "right") => void;
  }) => ReactNode;
};

type Props<T extends ColumnType> = {
  columns: Column<T>[];
  formState: ColumnType[];
  onChange: ({
    columnAccessorKey,
    rowIndex,
    value,
  }: {
    columnAccessorKey: Exclude<keyof T, symbol>;
    rowIndex: number;
    value: unknown;
  }) => void;
};

export default function GridTable<T extends ColumnType>({
  columns,
  formState,
  onChange,
}: Props<T>) {
  const cellsForFocusRef = useRef<Cell[]>([]);
  const focusedCellRef = useRef<Cell>(undefined);

  const setCellForFocus = (cell: Cell) => {
    cellsForFocusRef.current.push(cell);
  };

  const setFocusedCell = (cellToFocus: Omit<Cell, "focus">) => {
    const targetCell = cellsForFocusRef.current.find((cell) => {
      if (cell.topRow !== cellToFocus.topRow) return false;
      if (cell.leftColumn !== cellToFocus.leftColumn) return false;
      if (cell.bottomRow !== cellToFocus.bottomRow) return false;
      if (cell.rightColumn !== cellToFocus.rightColumn) return false;
      return true;
    });
    focusedCellRef.current = targetCell;
  };

  const move = (direction: "up" | "down" | "left" | "right") => {
    const targetCell = cellsForFocusRef.current.find((cell) => {
      if (!focusedCellRef.current) return false;

      const selectedCellMiddleColumn =
        (focusedCellRef.current.leftColumn +
          focusedCellRef.current.rightColumn) /
        2;
      const selectedCellMiddleRow =
        (focusedCellRef.current.topRow + focusedCellRef.current.bottomRow) / 2;

      switch (direction) {
        case "up":
          if (focusedCellRef.current.topRow !== cell.bottomRow) return false;
          if (selectedCellMiddleColumn < cell.leftColumn) return false;
          if (selectedCellMiddleColumn >= cell.rightColumn) return false;
          break;
        case "down":
          if (focusedCellRef.current.bottomRow !== cell.topRow) return false;
          if (selectedCellMiddleColumn < cell.leftColumn) return false;
          if (selectedCellMiddleColumn >= cell.rightColumn) return false;
          break;
        case "left":
          if (focusedCellRef.current.leftColumn !== cell.rightColumn)
            return false;
          if (selectedCellMiddleRow <= cell.topRow) return false;
          if (selectedCellMiddleRow > cell.bottomRow) return false;
          break;
        case "right":
          if (focusedCellRef.current.rightColumn !== cell.leftColumn)
            return false;
          if (selectedCellMiddleRow <= cell.topRow) return false;
          if (selectedCellMiddleRow > cell.bottomRow) return false;
          break;
        default:
          return false;
      }

      return true;
    });

    targetCell?.focus();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Grid Table</h1>
      <table className="table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr className="border-b border-gray-300 h-full">
            {columns.map((column) => (
              <th
                key={column.accessorKey}
                className="border border-gray-300 h-full"
              >
                {column.header({
                  columnAccessorKey: column.accessorKey,
                })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {formState.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-300 h-full">
              {columns.map((column) => (
                <td
                  key={column.accessorKey}
                  className="border border-gray-300 h-full"
                >
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
                    onFocus: (cell) => {
                      setFocusedCell({
                        topRow: rowIndex + cell.topRow,
                        leftColumn:
                          columns.findIndex(
                            (col) => col.accessorKey === column.accessorKey,
                          ) + cell.leftColumn,
                        bottomRow: rowIndex + cell.bottomRow,
                        rightColumn:
                          columns.findIndex(
                            (col) => col.accessorKey === column.accessorKey,
                          ) + cell.rightColumn,
                      });
                    },
                    onKeyDown: move,
                    onInitialize: (subCells) => {
                      subCells.forEach((subCell) => {
                        setCellForFocus({
                          topRow: rowIndex + subCell.topRow,
                          leftColumn:
                            columns.findIndex(
                              (col) => col.accessorKey === column.accessorKey,
                            ) + subCell.leftColumn,
                          bottomRow: rowIndex + subCell.bottomRow,
                          rightColumn:
                            columns.findIndex(
                              (col) => col.accessorKey === column.accessorKey,
                            ) + subCell.rightColumn,
                          focus: () => subCell.focus(),
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
