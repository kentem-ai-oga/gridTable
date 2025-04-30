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
 * チェックボックスセルのProps
 */
export interface CheckboxCellProps extends BaseCellProps<boolean> {
  /**
   * ラベル（オプション）
   */
  label?: string;

  /**
   * チェックボックスが無効状態かどうか
   */
  disabled?: boolean;
}

/**
 * チェックボックスセルコンポーネント
 * Excelライクな動作をするチェックボックスセル
 */
const CheckboxCell = forwardRef<CellComponentRef, CheckboxCellProps>(
  function CheckboxCell(
    {
      className = "",
      value = false,
      onChange,
      onFocus,
      onKeyDown,
      label,
      disabled = false,
      ...props
    },
    ref: ForwardedRef<CellComponentRef>,
  ) {
    // 選択状態用のチェックボックスのref
    const selectedCheckboxRef = useRef<HTMLInputElement>(null);

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
        {(renderProps: CellRenderProps<boolean>) => {
          const {
            mode,
            handleModeChange,
            selectedElementRef,
            handleKeyDown,
            handleEditingKeyDown,
            handleFocus,
            handleBlur,
            className,
            value,
            onChange,
          } = renderProps;

          /**
           * チェックボックス値変更ハンドラ
           */
          const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.checked);
          };

          /**
           * チェックボックス用のキーイベントハンドラ
           * スペースキーでチェック状態を切り替える
           */
          const handleCheckboxKeyDown = (
            e: React.KeyboardEvent<HTMLInputElement>,
          ) => {
            if (e.key === " " || e.key === "Spacebar") {
              e.preventDefault();
              onChange?.(!value);
            } else if (e.key === "F2") {
              // チェックボックスセルはF2キーを無視（編集と選択モードの区別があいまいなため）
              e.preventDefault();
            } else {
              // モードに応じたキーハンドラを使用
              if (mode === CellMode.SELECTED) {
                handleKeyDown(e);
              } else {
                handleEditingKeyDown(e);
              }
            }
          };

          // 選択状態と編集状態で共通のUI
          // チェックボックスは選択状態と編集状態の違いが小さいため
          const checkboxContent = (
            <div className="flex items-center">
              <input
                ref={
                  mode === CellMode.SELECTED
                    ? (selectedElementRef as unknown as RefObject<HTMLInputElement>)
                    : selectedCheckboxRef
                }
                type="checkbox"
                checked={value || false}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleCheckboxKeyDown}
                disabled={disabled}
                className={`${className} w-4 h-4 rounded focus:ring-2 focus:ring-blue-300`}
                aria-label={label || "チェックボックス"}
              />
              {label && <span className="ml-2 text-sm">{label}</span>}
            </div>
          );

          return mode === CellMode.SELECTED ? (
            <div
              className={`${className} flex items-center p-1`}
              onDoubleClick={() => handleModeChange(CellMode.EDITING)}
            >
              {checkboxContent}
            </div>
          ) : (
            <div
              className={`${className} flex items-center p-1 focus:outline-2 focus-visible:outline-2`}
            >
              {checkboxContent}
            </div>
          );
        }}
      </BaseCell>
    );
  },
);

export default CheckboxCell;
