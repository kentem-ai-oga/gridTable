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
import { CellComponentProps, CellComponentRef, MoveDirection } from "../types";

/**
 * セルの表示モード
 */
export enum CellMode {
  SELECTED = "selected",
  EDITING = "editing",
}

/**
 * BaseCellのレンダープロップスの型定義
 */
export interface CellRenderProps<T = unknown> {
  mode: CellMode;
  isJustFocused: boolean;
  setIsJustFocused: (value: boolean) => void;
  handleModeChange: (mode: CellMode) => void;
  selectedElementRef: RefObject<HTMLElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  handleEditingKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
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
   */
  defaultMode?: CellMode;

  /**
   * モード変更時のコールバック
   */
  onModeChange?: (mode: CellMode) => void;

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
 * キーボードナビゲーション設定
 * キーとMoveDirectionのマッピング
 */
const keyToDirectionMap: Record<string, MoveDirection> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

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
    defaultMode = CellMode.SELECTED,
    onModeChange,
    children,
  }: BaseCellProps<T>,
  ref: ForwardedRef<BaseCellRef>,
) {
  // セルの状態
  const [mode, setMode] = useState<CellMode>(defaultMode);
  const selectedElementRef = useRef<HTMLElement | null>(null);
  const [isJustFocused, setIsJustFocused] = useState(false);

  // Undo用の状態
  const [forUndo, setForUndo] = useState<{
    value?: T;
    isJustFocused: boolean;
  }>();

  // モード変更処理
  const handleModeChange = useCallback(
    (newMode: CellMode) => {
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
      startEditing: () => handleModeChange(CellMode.EDITING),
      stopEditing: () => handleModeChange(CellMode.SELECTED),
    }),
    [handleModeChange],
  ); /**
   * 選択モード時のキーボードイベントハンドラ
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      // F2キー処理（編集モードに切り替え）
      if (e.key === "F2") {
        e.preventDefault();
        handleModeChange(CellMode.EDITING);
        return;
      }

      // 方向キー処理
      if (keyToDirectionMap[e.key]) {
        e.preventDefault();
        onKeyDown?.(keyToDirectionMap[e.key]);
        return;
      }

      // Enterキー処理（上下移動）
      if (e.key === "Enter") {
        e.preventDefault();
        onKeyDown?.(e.shiftKey ? "up" : "down");
        return;
      }

      // Tabキー処理（左右移動）
      if (e.key === "Tab") {
        e.preventDefault();
        onKeyDown?.(e.shiftKey ? "left" : "right");
        return;
      }

      // Delete/Backspace処理
      if ((e.key === "Delete" || e.key === "Backspace") && isJustFocused) {
        e.preventDefault();
        setForUndo({ value, isJustFocused });
        onChange?.("" as unknown as T);
        return;
      }

      // Undo操作 (Ctrl+Z または Command+Z)
      if (
        e.key === "z" &&
        (e.ctrlKey || e.metaKey) &&
        forUndo?.value !== undefined
      ) {
        e.preventDefault();
        onChange?.(forUndo.value);
        setIsJustFocused(forUndo.isJustFocused);
        setForUndo({ value, isJustFocused });
      }
    },
    [forUndo, handleModeChange, isJustFocused, onChange, onKeyDown, value],
  );

  /**
   * 編集モード時のキーボードイベントハンドラ
   */
  const handleEditingKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      switch (e.key) {
        case "Enter": {
          e.preventDefault();
          handleModeChange(CellMode.SELECTED);
          if (e.shiftKey) onKeyDown?.("up");
          else onKeyDown?.("down");
          break;
        }
        case "Tab":
          e.preventDefault();
          handleModeChange(CellMode.SELECTED);
          if (e.shiftKey) onKeyDown?.("left");
          else onKeyDown?.("right");
          break;
        case "Escape":
          e.preventDefault();
          handleModeChange(CellMode.SELECTED);
          break;
      }
    },
    [handleModeChange, onKeyDown],
  );

  /**
   * フォーカス時の処理
   */
  const handleFocus = useCallback(() => {
    setIsJustFocused(true);
    onFocus?.();
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
        handleEditingKeyDown,
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
