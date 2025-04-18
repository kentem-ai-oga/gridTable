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
  const [mode, setMode] = useState<"selected" | "editing">("selected");
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isJustFocused, setIsJustFocused] = useState(false);
  const [forUndo, setForUndo] = useState<{
    value?: string | number;
    isJustFocused: boolean;
  }>();

  useImperativeHandle(ref, () => ({
    focus: () => {
      divRef.current?.focus();
    },
  }));

  return mode === "selected" ? (
    <div
      ref={divRef}
      tabIndex={0}
      className={`${className} flex items-center focus:outline-2 focus-visible:outline-2 focus:outline-blue-300`}
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
            } else {
              onChange?.(String(value).slice(0, -1));
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

        if (/^[a-zA-Z0-9]$/.test(e.key)) {
          if (isJustFocused) {
            setIsJustFocused(false);
            setForUndo({ value, isJustFocused });
            onChange?.(e.key);
          } else onChange?.(value + e.key);
        }
      }}
    >
      {value}
    </div>
  ) : (
    <input
      ref={inputRef}
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
