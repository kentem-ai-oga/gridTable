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
  const cellsRef = useRef<Cell[]>([]);
  const selectedCellRef = useRef<Cell>(undefined);

  const addCell = (cell: Cell) => {
    cellsRef.current.push(cell);
  };

  const focusCell = (cellToFocus: Omit<Cell, "focus">) => {
    const targetCell = cellsRef.current.find((cell) => {
      if (cell.topRow !== cellToFocus.topRow) return false;
      if (cell.leftColumn !== cellToFocus.leftColumn) return false;
      if (cell.bottomRow !== cellToFocus.bottomRow) return false;
      if (cell.rightColumn !== cellToFocus.rightColumn) return false;
      return true;
    });
    selectedCellRef.current = targetCell;
  };

  const moveUp = () => {
    const upCell = cellsRef.current.find((cell) => {
      if (!selectedCellRef.current) return false;
      if (selectedCellRef.current.topRow !== cell.bottomRow) return false;

      const selectedCellMiddleColumn =
        (selectedCellRef.current.leftColumn +
          selectedCellRef.current.rightColumn) /
        2;
      if (selectedCellMiddleColumn < cell.leftColumn) return false;
      if (selectedCellMiddleColumn >= cell.rightColumn) return false;
      return true;
    });
    upCell?.focus();
  };

  const moveDown = () => {
    const downCell = cellsRef.current.find((cell) => {
      if (!selectedCellRef.current) return false;
      if (selectedCellRef.current.bottomRow !== cell.topRow) return false;

      const selectedCellMiddleColumn =
        (selectedCellRef.current.leftColumn +
          selectedCellRef.current.rightColumn) /
        2;
      if (selectedCellMiddleColumn < cell.leftColumn) return false;
      if (selectedCellMiddleColumn >= cell.rightColumn) return false;
      return true;
    });
    downCell?.focus();
  };

  const moveLeft = () => {
    const leftCell = cellsRef.current.find((cell) => {
      if (!selectedCellRef.current) return false;
      if (selectedCellRef.current.leftColumn !== cell.rightColumn) return false;

      const selectedCellMiddleRow =
        (selectedCellRef.current.topRow + selectedCellRef.current.bottomRow) /
        2;
      if (selectedCellMiddleRow <= cell.topRow) return false;
      if (selectedCellMiddleRow > cell.bottomRow) return false;
      return true;
    });
    leftCell?.focus();
  };

  const moveRight = () => {
    const rightCell = cellsRef.current.find((cell) => {
      if (!selectedCellRef.current) return false;
      if (selectedCellRef.current.rightColumn !== cell.leftColumn) return false;

      const selectedCellMiddleRow =
        (selectedCellRef.current.topRow + selectedCellRef.current.bottomRow) /
        2;
      if (selectedCellMiddleRow <= cell.topRow) return false;
      if (selectedCellMiddleRow > cell.bottomRow) return false;
      return true;
    });
    rightCell?.focus();
  };

  return {
    addCell,
    focusCell,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
  };
}
