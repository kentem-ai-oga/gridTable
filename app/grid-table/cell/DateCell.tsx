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
 * 日付セルのProps
 */
export interface DateCellProps extends BaseCellProps<Date | string | null> {
  /**
   * 日付の表示フォーマット
   */
  displayFormat?: string;

  /**
   * 最小選択可能日付
   */
  minDate?: Date | string;

  /**
   * 最大選択可能日付
   */
  maxDate?: Date | string;

  /**
   * 日付入力が無効状態かどうか
   */
  disabled?: boolean;

  /**
   * 時間も含めるかどうか
   */
  includeTime?: boolean;
}

/**
 * 日付を指定されたフォーマットで文字列に変換
 */
const formatDate = (
  date: Date | string | null,
  format: string = "YYYY-MM-DD",
  includeTime: boolean = false,
): string => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return "";
    }

    // 日付部分のフォーマット
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    let result = format
      .replace("YYYY", String(year))
      .replace("MM", month)
      .replace("DD", day);

    // 時間部分のフォーマット（オプション）
    if (includeTime) {
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      const seconds = String(dateObj.getSeconds()).padStart(2, "0");

      result = result
        .replace("HH", hours)
        .replace("mm", minutes)
        .replace("ss", seconds);
    }

    return result;
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

/**
 * 文字列を日付に変換
 */
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * 日付入力セルコンポーネント
 * Excelライクな動作をする日付入力セル
 */
const DateCell = forwardRef<CellComponentRef, DateCellProps>(function DateCell(
  {
    className = "",
    value = null,
    onChange,
    onFocus,
    onKeyDown,
    displayFormat = "YYYY-MM-DD",
    minDate,
    maxDate,
    disabled = false,
    includeTime = false,
    ...props
  },
  ref: ForwardedRef<CellComponentRef>,
) {
  // 編集状態用のinputのref
  const editingInputRef = useRef<HTMLInputElement>(null);

  // 入力タイプ
  const inputType = includeTime ? "datetime-local" : "date";

  // 日付をHTMLのdate inputで使用できる形式に変換
  const formatDateForInput = (date: Date | string | null): string => {
    if (!date) return "";

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;

      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return "";
      }

      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");

      if (includeTime) {
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  }; // 入力用の文字列を生成
  const inputString = formatDateForInput(value);

  // minDateとmaxDateを文字列に変換
  const minDateString = minDate ? formatDateForInput(minDate) : "";
  const maxDateString = maxDate ? formatDateForInput(maxDate) : "";

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
      {(renderProps: CellRenderProps<Date | string | null>) => {
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
        } = renderProps; // 選択状態ではダイレクト入力は行わない

        /**
         * 編集状態での値変更
         */
        const handleEditingChange = (e: ChangeEvent<HTMLInputElement>) => {
          const newDate = parseDate(e.target.value);
          onChange?.(newDate);
        };

        /**
         * セル表示のフォーマット
         */
        const formattedDisplayValue = formatDate(
          value,
          displayFormat,
          includeTime,
        );

        return mode === CellMode.SELECTED ? (
          <div
            ref={selectedElementRef as RefObject<HTMLDivElement>}
            className={`${className} px-2 py-1 flex items-center`}
            tabIndex={0}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onDoubleClick={() => handleModeChange(CellMode.EDITING)}
            style={{ minHeight: "1.5rem" }}
          >
            {formattedDisplayValue || ""}
          </div>
        ) : (
          <input
            ref={editingInputRef}
            className={`${className} w-full h-full px-1 py-1 focus:outline-2 focus-visible:outline-2`}
            type={inputType}
            value={inputString}
            onChange={handleEditingChange}
            onFocus={onFocus}
            onBlur={() => {
              handleBlur();
              handleModeChange(CellMode.SELECTED);
            }}
            min={minDateString}
            max={maxDateString}
            disabled={disabled}
            onKeyDown={handleEditingKeyDown}
          />
        );
      }}
    </BaseCell>
  );
});

export default DateCell;
