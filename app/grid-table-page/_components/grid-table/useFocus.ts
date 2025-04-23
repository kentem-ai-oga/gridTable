// GridTable全体のフォーカスを制御するためのカスタムフック

import { useRef } from "react";

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

export default function useFocus() {
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

  const moveUp = () => {
    const upCell = cellsForFocusRef.current.find((cell) => {
      if (!focusedCellRef.current) return false;
      if (focusedCellRef.current.topRow !== cell.bottomRow) return false;

      const selectedCellMiddleColumn =
        (focusedCellRef.current.leftColumn +
          focusedCellRef.current.rightColumn) /
        2;
      if (selectedCellMiddleColumn < cell.leftColumn) return false;
      if (selectedCellMiddleColumn >= cell.rightColumn) return false;
      return true;
    });
    upCell?.focus();
  };

  const moveDown = () => {
    const downCell = cellsForFocusRef.current.find((cell) => {
      if (!focusedCellRef.current) return false;
      if (focusedCellRef.current.bottomRow !== cell.topRow) return false;

      const selectedCellMiddleColumn =
        (focusedCellRef.current.leftColumn +
          focusedCellRef.current.rightColumn) /
        2;
      if (selectedCellMiddleColumn < cell.leftColumn) return false;
      if (selectedCellMiddleColumn >= cell.rightColumn) return false;
      return true;
    });
    downCell?.focus();
  };

  const moveLeft = () => {
    const leftCell = cellsForFocusRef.current.find((cell) => {
      if (!focusedCellRef.current) return false;
      if (focusedCellRef.current.leftColumn !== cell.rightColumn) return false;

      const selectedCellMiddleRow =
        (focusedCellRef.current.topRow + focusedCellRef.current.bottomRow) / 2;
      if (selectedCellMiddleRow <= cell.topRow) return false;
      if (selectedCellMiddleRow > cell.bottomRow) return false;
      return true;
    });
    leftCell?.focus();
  };

  const moveRight = () => {
    const rightCell = cellsForFocusRef.current.find((cell) => {
      if (!focusedCellRef.current) return false;
      if (focusedCellRef.current.rightColumn !== cell.leftColumn) return false;

      const selectedCellMiddleRow =
        (focusedCellRef.current.topRow + focusedCellRef.current.bottomRow) / 2;
      if (selectedCellMiddleRow <= cell.topRow) return false;
      if (selectedCellMiddleRow > cell.bottomRow) return false;
      return true;
    });
    rightCell?.focus();
  };

  return {
    setCellForFocus,
    setFocusedCell,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
  };
}
