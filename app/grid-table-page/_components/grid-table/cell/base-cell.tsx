"use client";

import {
  ForwardedRef,
  forwardRef,
  JSX,
  ReactNode,
  RefObject,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { CellComponentProps, CellComponentRef } from "../types";

// BaseCellのレンダープロップスの型定義
export interface CellRenderProps<T = unknown> {
  mode: "selected" | "editing";
  isJustFocused: boolean;
  setIsJustFocused: (value: boolean) => void;
  handleModeChange: (mode: "selected" | "editing") => void;
  selectedElementRef: RefObject<HTMLElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  setForUndo: (
    value: { value?: T; isJustFocused: boolean } | undefined,
  ) => void;
  forUndo?: { value?: T; isJustFocused: boolean };
  className: string;
  value: T;
  onChange?: (value: T) => void;
}

/**
 * BaseCellのProps
 */
export interface BaseCellProps<T = unknown> extends CellComponentProps<T> {
  /**
   * セルの表示モード
   * - "selected": セルが選択されている状態（デフォルト）
   * - "editing": セルが編集中の状態
   */
  defaultMode?: "selected" | "editing";

  /**
   * モード変更時のコールバック
   */
  onModeChange?: (mode: "selected" | "editing") => void;

  /**
   * 子要素のレンダリング関数
   */
  children?: (props: CellRenderProps<T>) => ReactNode;
}

/**
 * 基底セルのRef
 */
export interface BaseCellRef extends CellComponentRef {
  /**
   * セルモードを編集状態に切り替え
   */
  startEditing: () => void;

  /**
   * セルモードを選択状態に切り替え
   */
  stopEditing: () => void;
}

/**
 * 基底セルコンポーネント
 * GridTableの各セルタイプの基底となるコンポーネント
 */
function BaseCellComponent<T = unknown>(
  {
    className = "",
    value = "" as unknown as T,
    onChange,
    onFocus,
    onKeyDown,
    defaultMode = "selected",
    onModeChange,
    children,
  }: BaseCellProps<T>,
  ref: ForwardedRef<BaseCellRef>,
) {
  // セルの状態: selected（選択）またはediting（編集中）
  const [mode, setMode] = useState<"selected" | "editing">(defaultMode);

  // selected状態用のref
  const selectedElementRef = useRef<HTMLElement | null>(null);

  // セルが選択された直後は文字入力されると元の文字が消えるため、その制御に利用
  const [isJustFocused, setIsJustFocused] = useState(false);

  // Undo用の状態
  const [forUndo, setForUndo] = useState<{
    value?: T;
    isJustFocused: boolean;
  }>();

  // モード変更処理 - useCallbackでメモ化
  const handleModeChange = useCallback(
    (newMode: "selected" | "editing") => {
      setMode(newMode);
      onModeChange?.(newMode);
    },
    [onModeChange],
  );

  // 外部からのインターフェースを提供
  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        selectedElementRef.current?.focus();
      },
      startEditing: () => handleModeChange("editing"),
      stopEditing: () => handleModeChange("selected"),
    }),
    [handleModeChange],
  );

  /**
   * キーボードイベントの共通ハンドラ
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          onKeyDown?.("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          onKeyDown?.("down");
          break;
        case "ArrowLeft":
          e.preventDefault();
          onKeyDown?.("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          onKeyDown?.("right");
          break;
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
        case "Delete":
        case "Backspace":
          if (isJustFocused) {
            e.preventDefault();
            setForUndo({ value, isJustFocused });
            onChange?.("" as unknown as T);
          }
          break;
      }

      // Undo操作 (Ctrl+Z または Command+Z)
      if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        if (forUndo?.value === undefined) return;
        e.preventDefault();
        onChange?.(forUndo.value);
        setIsJustFocused(forUndo.isJustFocused);
        setForUndo({
          value,
          isJustFocused,
        });
      }
    },
    [forUndo, isJustFocused, onChange, onKeyDown, value],
  );

  /**
   * フォーカス時の処理
   */
  const handleFocus = useCallback(() => {
    setIsJustFocused(true);
    if (onFocus) {
      onFocus();
    }
  }, [onFocus]);

  /**
   * フォーカス外れた時の処理
   */
  const handleBlur = useCallback(() => {
    setForUndo(undefined);
  }, []);

  /**
   * レンダリング内容
   * 子要素を注入することで拡張可能
   */
  return typeof children === "function"
    ? children({
        mode,
        isJustFocused,
        setIsJustFocused,
        handleModeChange,
        selectedElementRef,
        handleKeyDown,
        handleFocus,
        handleBlur,
        setForUndo,
        forUndo,
        className,
        value,
        onChange,
      })
    : null;
}

const BaseCell = forwardRef(BaseCellComponent) as <T = unknown>(
  props: BaseCellProps<T> & { ref?: ForwardedRef<BaseCellRef> },
) => JSX.Element | null;

export default BaseCell;
