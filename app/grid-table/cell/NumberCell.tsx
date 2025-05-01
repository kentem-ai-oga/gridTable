"use client";

import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  RefObject,
  useRef,
} from "react";
import { CellComponentRef } from "../types";
import BaseCell, {
  BaseCellProps,
  BaseCellRef,
  CellMode,
  CellRenderProps,
} from "./BaseCell";

/**
 * NumberCellのProps
 * 数値専用の入力セル用のprops
 */
export type NumberCellProps = BaseCellProps<number> & {
  /**
   * 最小値
   */
  min?: number;

  /**
   * 最大値
   */
  max?: number;

  /**
   * ステップ値 (増減の単位)
   */
  step?: number;
};

/**
 * 数値専用入力セルコンポーネント
 */
const NumberCell = forwardRef<CellComponentRef, NumberCellProps>(
  function NumberCell(
    {
      className = "",
      value = 0,
      onChange,
      onFocus,
      onKeyDown,
      min,
      max,
      step = 1,
      ...props
    },
    ref: ForwardedRef<CellComponentRef>,
  ) {
    // editing状態用のinputのref
    const editingInputRef = useRef<HTMLInputElement>(null); /**
     * カーソル位置をテキストの最後に移動
     * type="number"の場合はsetSelectionRangeが利用できないため何もしない
     */
    const handleSelect = (input: HTMLInputElement) => {
      // type="number"の場合はsetSelectionRangeを実行しない
      if (input.type !== "number") {
        const length = String(input.value).length;
        input.setSelectionRange(length, length);
      }
    };

    /**
     * 数値変換関数
     * 入力値を適切な数値に変換し、min/maxの範囲内に収める
     */
    const parseNumericValue = (inputValue: string): number => {
      // 数値に変換
      const numValue = Number(inputValue);

      // 数値でなければ0を返す
      if (isNaN(numValue)) return 0;

      // min/maxの範囲内に収める
      if (min !== undefined && numValue < min) return min;
      if (max !== undefined && numValue > max) return max;

      return numValue;
    };

    return (
      <BaseCell
        className={className}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        {...props}
        ref={ref as ForwardedRef<BaseCellRef>}
      >
        {(renderProps: CellRenderProps<number>) => {
          const {
            mode,
            isJustFocused,
            setIsJustFocused,
            handleModeChange,
            selectedElementRef,
            handleKeyDown,
            handleEditingKeyDown,
            handleFocus,
            handleBlur,
            setForUndo,
            className,
            value,
            onChange,
          } = renderProps;

          /**
           * 選択状態での値変更
           */
          const handleSelectedChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (isJustFocused) {
              setIsJustFocused(false);
              setForUndo({ value, isJustFocused });

              // 最後の1文字を数値に変換
              const lastChar = e.target.value.slice(-1);
              const parsedValue = parseNumericValue(lastChar);
              onChange?.(parsedValue);
            } else {
              // 入力全体を数値に変換
              const parsedValue = parseNumericValue(e.target.value);
              onChange?.(parsedValue);
            }
          };

          /**
           * 編集状態での値変更
           */
          const handleEditingChange = (e: ChangeEvent<HTMLInputElement>) => {
            // 入力を数値に変換して適用
            const parsedValue = parseNumericValue(e.target.value);
            onChange?.(parsedValue);
          };

          return mode === CellMode.SELECTED ? (
            <input
              ref={selectedElementRef as RefObject<HTMLInputElement>}
              // Excelに寄せるため、キャレット(カーソル)を透明にしている
              className={`${className} focus:outline-2 focus-visible:outline-2 focus:outline-blue-300 caret-transparent text-right`}
              value={value}
              onChange={handleSelectedChange}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              // セルのどこをクリックしてもフォーカスが必ず最後に当たるようにしている
              onSelect={(e) => handleSelect(e.currentTarget)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onDoubleClick={() => handleModeChange(CellMode.EDITING)}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <input
              ref={editingInputRef}
              className={`${className} focus:outline-2 focus-visible:outline-2 text-right`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={isNaN(value) ? "" : value}
              onChange={handleEditingChange}
              onFocus={onFocus}
              onBlur={() => {
                handleModeChange(CellMode.SELECTED);
                setForUndo(undefined);
              }}
              onKeyDown={(e) => {
                // まず共通のキーハンドリングを処理
                handleEditingKeyDown(e);

                // 次に数値特有の処理（上下キーの処理）
                switch (e.key) {
                  case "ArrowUp":
                    // 上キーでステップ値を加算
                    onChange?.(parseNumericValue(String(Number(value) + step)));
                    break;
                  case "ArrowDown":
                    // 下キーでステップ値を減算
                    onChange?.(parseNumericValue(String(Number(value) - step)));
                    break;
                }
              }}
            />
          );
        }}
      </BaseCell>
    );
  },
);

export default NumberCell;
