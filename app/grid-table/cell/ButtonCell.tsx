"use client";

import { ForwardedRef, forwardRef, ReactNode, RefObject } from "react";
import { CellComponentRef } from "../types";
import BaseCell, {
  BaseCellProps,
  BaseCellRef,
  CellRenderProps,
} from "./BaseCell";

/**
 * ボタンの外観バリアント
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";

/**
 * ボタンセルのProps
 */
export interface ButtonCellProps extends BaseCellProps<string> {
  /**
   * ボタンのラベル
   * value が指定されていない場合はこちらが使用される
   */
  label?: string;

  /**
   * ボタンのアイコン
   */
  icon?: ReactNode;

  /**
   * ボタンがクリックされたときのコールバック
   */
  onClick?: () => void;

  /**
   * ボタンの外観バリアント
   */
  variant?: ButtonVariant;

  /**
   * ボタンが無効状態かどうか
   */
  disabled?: boolean;
}

/**
 * ボタンセルコンポーネント
 */
const ButtonCell = forwardRef<CellComponentRef, ButtonCellProps>(
  function ButtonCell(
    {
      className = "",
      value = "",
      label,
      icon,
      onClick,
      onFocus,
      onKeyDown,
      variant = "primary",
      disabled = false,
      ...props
    },
    ref: ForwardedRef<CellComponentRef>,
  ) {
    // ボタンの外観クラス
    const variantClasses: Record<ButtonVariant, string> = {
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      secondary: "bg-gray-500 hover:bg-gray-600 text-white",
      success: "bg-green-500 hover:bg-green-600 text-white",
      danger: "bg-red-500 hover:bg-red-600 text-white",
      warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
      info: "bg-cyan-500 hover:bg-cyan-600 text-white",
    };

    // ボタン表示用のテキスト
    const displayText = label || value;

    return (
      <BaseCell
        className={className}
        value={value}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        {...props}
        ref={ref as ForwardedRef<BaseCellRef>}
      >
        {(renderProps: CellRenderProps<string>) => {
          const {
            // mode変数は不使用（ボタンセルは常に選択状態のみ）
            selectedElementRef,
            handleKeyDown,
            handleFocus,
            handleBlur,
            className,
          } = renderProps;

          /**
           * ボタンキーイベントハンドラ
           */
          const handleButtonKeyDown = (
            e: React.KeyboardEvent<HTMLButtonElement>,
          ) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              if (!disabled && onClick) {
                onClick();
              }
            } else if (e.key === "F2") {
              // ボタンセルはF2キーを無視（編集モードがないため）
              e.preventDefault();
            } else {
              handleKeyDown(e);
            }
          };

          // ボタンセルは通常常に選択状態で表示
          // 編集状態はボタンには不要なため、選択状態のみを実装
          return (
            <button
              ref={selectedElementRef as RefObject<HTMLButtonElement>}
              className={`${className} ${
                variantClasses[variant]
              } rounded px-4 py-2 text-sm font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={onClick}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleButtonKeyDown}
              disabled={disabled}
              type="button"
            >
              {icon && <span className="mr-1">{icon}</span>}
              {displayText}
            </button>
          );
        }}
      </BaseCell>
    );
  },
);

export default ButtonCell;
