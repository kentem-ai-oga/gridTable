// GridTable本体

import { ReactNode } from "react";
import useFocus, { Cell } from "./useFocus";

// 1セルの中でセルが分割されないケースで使う
export const CELL_WITHOUT_SUBCELL = {
  topRow: 0,
  leftColumn: 0,
  bottomRow: 1,
  rightColumn: 1,
} as const satisfies Omit<Cell, "focus">;

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
    onKeyDownUp,
    onKeyDownDown,
    onKeyDownLeft,
    onKeyDownRight,
  }: {
    rowIndex: number;
    columnAccessorKey: Exclude<keyof T, symbol>;
    value: unknown;
    onChange?: (value: unknown) => void;
    onFocus?: (cell: Omit<Cell, "focus">) => void;
    onInitialize?: (subCells: Cell[]) => void;
    onKeyDownUp?: () => void;
    onKeyDownDown?: () => void;
    onKeyDownLeft?: () => void;
    onKeyDownRight?: () => void;
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
  const { addCell, focusCell, moveUp, moveDown, moveLeft, moveRight } =
    useFocus();

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
                      focusCell({
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
                    onKeyDownUp: moveUp,
                    onKeyDownDown: moveDown,
                    onKeyDownLeft: moveLeft,
                    onKeyDownRight: moveRight,
                    onInitialize: (subCells) => {
                      subCells.forEach((subCell) => {
                        addCell({
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
