"use client";

import {
  ChangeEvent,
  ComponentProps,
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
 * InputCellのProps
 */
export interface InputCellProps extends BaseCellProps<string | number> {
  /**
   * 入力タイプ
   * HTMLのinput typeと同じ
   */
  type?: ComponentProps<"input">["type"];
}

/**
 * 汎用入力セルコンポーネント
 * Excelライクな動作をする入力セル
 */
const InputCell = forwardRef<CellComponentRef, InputCellProps>(
  function InputCell(
    {
      type = "text",
      className = "",
      value = "",
      onChange,
      onFocus,
      onKeyDown,
      ...props
    },
    ref: ForwardedRef<CellComponentRef>,
  ) {
    // editing状態用のinputのref
    const editingInputRef = useRef<HTMLInputElement>(null);

    /**
     * カーソル位置をテキストの最後に移動
     */
    const handleSelect = (input: HTMLInputElement) => {
      const length = String(input.value).length;
      input.setSelectionRange(length, length);
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
        {(renderProps: CellRenderProps<string | number>) => {
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
              onChange?.(e.target.value.slice(-1));
            } else {
              onChange?.(e.target.value);
            }
          };

          /**
           * 編集状態での値変更
           */
          const handleEditingChange = (e: ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.value);
          };

          return mode === CellMode.SELECTED ? (
            <input
              ref={selectedElementRef as RefObject<HTMLInputElement>}
              // Excelに寄せるため、キャレット(カーソル)を透明にしている
              className={`${className} focus:outline-2 focus-visible:outline-2 focus:outline-blue-300 caret-transparent`}
              value={value}
              onChange={handleSelectedChange}
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
              className={`${className} focus:outline-2 focus-visible:outline-2`}
              type={type}
              value={value}
              onChange={handleEditingChange}
              onFocus={onFocus}
              onBlur={() => {
                handleModeChange(CellMode.SELECTED);
                setForUndo(undefined);
              }}
              onKeyDown={handleEditingKeyDown}
            />
          );
        }}
      </BaseCell>
    );
  },
);

export default InputCell;
