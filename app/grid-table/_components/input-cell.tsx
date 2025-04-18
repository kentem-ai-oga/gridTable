"use client";

import {
  ComponentProps,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type Props = Pick<
  ComponentProps<"input">,
  "className" | "type" | "value" | "onChange" | "onFocus"
> & {
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
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef1.current?.focus();
    },
  }));

  return mode === "selected" ? (
    <input
      ref={inputRef1}
      className={`${className} focus:outline-2 focus-visible:outline-2 focus:outline-blue-300`}
      type="text"
      value={value}
      onChange={onChange}
      onFocus={(e) => {
        onFocus?.(e);
        inputRef1.current?.setSelectionRange(
          String(value).length,
          String(value).length,
        );
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
          case "Tab":
            e.preventDefault();
            break;
        }
      }}
    />
  ) : (
    <input
      ref={inputRef2}
      className={`${className} focus:outline-2 focus-visible:outline-2`}
      type={type}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={() => setMode("selected")}
      onKeyDown={(e) => {
        switch (e.key) {
          case "Enter":
          case "Escape":
          case "Tab":
            e.preventDefault();
            setMode("selected");
            break;
        }
      }}
    />
  );
});
