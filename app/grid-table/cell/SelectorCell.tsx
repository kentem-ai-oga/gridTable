"use client";

import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  ReactElement,
  RefObject,
  useEffect,
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
 * セレクトオプションの型定義
 */
export interface SelectOption<T = string> {
  /**
   * オプションの値
   */
  value: T;

  /**
   * オプションの表示ラベル
   */
  label: string;

  /**
   * オプションが選択不可かどうか
   */
  disabled?: boolean;
}

/**
 * セレクトセルのProps
 */
export interface SelectCellProps<T = string> extends BaseCellProps<T> {
  /**
   * セレクトオプションの配列
   */
  options: SelectOption<T>[];

  /**
   * プレースホルダーテキスト
   * 未選択時に表示される
   */
  placeholder?: string;

  /**
   * セレクトが無効状態かどうか
   */
  disabled?: boolean;
}

/**
 * セレクトセルコンポーネント
 * Excelライクな動作をするドロップダウン選択セル
 */
function SelectCell<T = string>(
  {
    className = "",
    value,
    onChange,
    onFocus,
    onKeyDown,
    options = [],
    placeholder = "選択してください",
    disabled = false,
    ...props
  }: SelectCellProps<T>,
  ref: ForwardedRef<CellComponentRef>,
) {
  // 編集状態用のセレクトのref
  const editingSelectRef = useRef<HTMLSelectElement>(null);

  // 編集状態になったときに自動的にフォーカスを設定
  useEffect(() => {
    if (editingSelectRef.current) {
      editingSelectRef.current.focus();
    }
  }, [editingSelectRef]);

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
      {(renderProps: CellRenderProps<T>) => {
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

        // 現在選択されている項目のラベルを取得
        const selectedOption = options.find((opt) => opt.value === value);
        const displayText = selectedOption ? selectedOption.label : placeholder;

        /**
         * セレクト値変更ハンドラ
         */
        const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
          // 選択された値に対応するオプションを見つける
          const selectedOption = options.find(
            (opt) => String(opt.value) === e.target.value,
          );

          if (selectedOption) {
            onChange?.(selectedOption.value);
          }
        };

        /**
         * セレクト要素のIDを生成（安定した一意の値）
         */
        const getSelectId = () => {
          return `select-cell-${Math.random().toString(36).substring(2, 9)}`;
        };

        return mode === CellMode.SELECTED ? (
          <div
            ref={selectedElementRef as RefObject<HTMLDivElement>}
            className={`${className} px-2 py-1 cursor-pointer flex items-center focus:outline-2 focus-visible:outline-2 focus:outline-blue-300`}
            tabIndex={0}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleModeChange(CellMode.EDITING);
              } else {
                handleKeyDown(e);
              }
            }}
            onDoubleClick={() => handleModeChange(CellMode.EDITING)}
            style={{ minHeight: "1.5rem" }}
          >
            <span className={!selectedOption ? "text-gray-400" : ""}>
              {displayText}
            </span>
          </div>
        ) : (
          <select
            id={getSelectId()}
            ref={editingSelectRef}
            className={`${className} w-full h-full px-1 py-1 focus:outline-2 focus-visible:outline-2 focus:outline-blue-300`}
            value={String(value !== undefined ? value : "")}
            onChange={handleSelectChange}
            onFocus={onFocus}
            onBlur={() => {
              handleBlur();
              handleModeChange(CellMode.SELECTED);
            }}
            onKeyDown={handleEditingKeyDown}
            disabled={disabled}
          >
            {/* プレースホルダー用の無効なオプション */}
            {!selectedOption && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {/* 実際の選択肢 */}
            {options.map((option) => (
              <option
                key={String(option.value)}
                value={String(option.value)}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
      }}
    </BaseCell>
  );
}

// ジェネリック型を保持したまま、forwardRefでラップ
const SelectCellWithRef = forwardRef(SelectCell) as <T = string>(
  props: SelectCellProps<T> & { ref?: ForwardedRef<CellComponentRef> },
) => ReactElement;

export default SelectCellWithRef;
