// filepath: c:\Users\ai-oga\Documents\cloud-workledger\code\gridtable\app\grid-table-page\_components\grid-table\cell\input-cell.tsx
// GridTableで最も一般的に使われる入力セル

"use client";

import { ComponentProps, ForwardedRef, forwardRef, useRef } from "react";
import { CellComponentRef } from "../types";
import BaseCell, {
  BaseCellProps,
  BaseCellRef,
  CellRenderProps,
} from "./base-cell";

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
          const handleSelectedChange = (
            e: React.ChangeEvent<HTMLInputElement>,
          ) => {
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
          const handleEditingChange = (
            e: React.ChangeEvent<HTMLInputElement>,
          ) => {
            onChange?.(e.target.value);
          };

          return mode === "selected" ? (
            <input
              ref={selectedElementRef as React.RefObject<HTMLInputElement>}
              // Excelに寄せるため、キャレット(カーソル)を透明にしている
              className={`${className} focus:outline-2 focus-visible:outline-2 focus:outline-blue-300 caret-transparent`}
              value={value}
              onChange={handleSelectedChange}
              // セルのどこをクリックしてもフォーカスが必ず最後に当たるようにしている
              onSelect={(e) => handleSelect(e.currentTarget)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onDoubleClick={() => handleModeChange("editing")}
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
                handleModeChange("selected");
                setForUndo(undefined);
              }}
              onKeyDown={(e) => {
                switch (e.key) {
                  case "Enter": {
                    e.preventDefault();
                    if (e.shiftKey) onKeyDown?.("up");
                    else onKeyDown?.("down");
                    break;
                  }
                  case "Tab":
                    e.preventDefault();
                    if (e.shiftKey) onKeyDown?.("left");
                    else onKeyDown?.("right");
                    break;
                  case "Escape":
                    e.preventDefault();
                    handleModeChange("selected");
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

export default InputCell;
