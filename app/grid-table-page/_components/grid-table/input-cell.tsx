// GridTableで最も一般的に使われる入力セル

"use client";

import {
  ComponentProps,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type Props = Pick<ComponentProps<"input">, "className" | "type"> & {
  value?: string | number;
  onChange?: (newValue: string | number) => void;
  onFocus?: () => void;
  onKeyDownUp?: () => void;
  onKeyDownDown?: () => void;
  onKeyDownLeft?: () => void;
  onKeyDownRight?: () => void;
};

export default forwardRef<{ focus: () => void }, Props>(function InputCell(
  {
    type = "text",
    className,
    value,
    onChange,
    onFocus,
    onKeyDownUp,
    onKeyDownDown,
    onKeyDownLeft,
    onKeyDownRight,
  },
  ref,
) {
  // Excelのセルをクリックしたときの状態がselected、ダブルクリックしたときの状態がediting
  const [mode, setMode] = useState<"selected" | "editing">("selected");

  // selected状態用のinputのref
  const selectedInputRef = useRef<HTMLInputElement>(null);

  // editing状態用のinputのref
  const editingInputRef = useRef<HTMLInputElement>(null);

  // セルが選択された直後は文字入力されると元の文字が消えるため、その制御に利用
  const [isJustFocused, setIsJustFocused] = useState(false);
  const [forUndo, setForUndo] = useState<{
    value?: string | number;
    isJustFocused: boolean;
  }>();

  // このコンポーネントからfocusだけをrefとして外に出すためのもの
  // https://ja.react.dev/reference/react/useImperativeHandle
  useImperativeHandle(ref, () => ({
    focus: () => {
      selectedInputRef.current?.focus();
    },
  }));

  return mode === "selected" ? (
    <input
      ref={selectedInputRef}
      // Excelに寄せるため、キャレット(カーソル)を透明にしている
      className={`${className} focus:outline-2 focus-visible:outline-2 focus:outline-blue-300 caret-transparent`}
      value={value}
      onChange={(e) => {
        if (isJustFocused) {
          setIsJustFocused(false);
          setForUndo({ value, isJustFocused });
          onChange?.(e.target.value.slice(-1));
        } else onChange?.(e.target.value);
      }}
      // セルのどこをクリックしてもフォーカスが必ず最後に当たるようにしている
      onSelect={() => {
        if (!selectedInputRef.current) return;
        const length = selectedInputRef.current.value.length;
        selectedInputRef.current.setSelectionRange(length, length);
      }}
      onFocus={() => {
        setIsJustFocused(true);
        onFocus?.();
      }}
      onBlur={() => {
        setForUndo(undefined);
      }}
      onDoubleClick={() => setMode("editing")}
      onKeyDown={(e) => {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            onKeyDownUp?.();
            break;
          case "ArrowDown":
            e.preventDefault();
            onKeyDownDown?.();
            break;
          case "ArrowRight":
            e.preventDefault();
            onKeyDownRight?.();
            break;
          case "ArrowLeft":
            e.preventDefault();
            onKeyDownLeft?.();
            break;
          case "Enter": {
            e.preventDefault();
            if (e.shiftKey) onKeyDownUp?.();
            else onKeyDownDown?.();
            break;
          }
          case "Tab":
            e.preventDefault();
            if (e.shiftKey) onKeyDownLeft?.();
            else onKeyDownRight?.();
            break;
          case "Delete":
            if (isJustFocused) {
              e.preventDefault();
              setForUndo({ value, isJustFocused });
              onChange?.("");
            }
            break;
          case "Backspace":
            if (isJustFocused) {
              e.preventDefault();
              setForUndo({ value, isJustFocused });
              onChange?.("");
            }
            break;
        }

        if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
          if (forUndo?.value === undefined) return;
          e.preventDefault();
          onChange?.(forUndo.value);
          setIsJustFocused(forUndo.isJustFocused);
          setForUndo({
            value,
            isJustFocused,
          });
          return;
        }
      }}
    />
  ) : (
    <input
      ref={editingInputRef}
      className={`${className} focus:outline-2 focus-visible:outline-2`}
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onFocus={onFocus}
      onBlur={() => {
        setMode("selected");
        setForUndo(undefined);
      }}
      onKeyDown={(e) => {
        switch (e.key) {
          case "Enter": {
            e.preventDefault();
            if (e.shiftKey) onKeyDownUp?.();
            else onKeyDownDown?.();
            break;
          }
          case "Tab":
            e.preventDefault();
            if (e.shiftKey) onKeyDownLeft?.();
            else onKeyDownRight?.();
            break;
          case "Escape":
            e.preventDefault();
            setMode("selected");
            break;
        }
      }}
    />
  );
});
