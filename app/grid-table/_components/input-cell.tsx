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
  "className" | "type" | "value" | "onChange"
>;

export default forwardRef(function InputCell(
  { type = "text", className, value, onChange }: Props,
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
      onDoubleClick={() => setMode("editing")}
      onKeyDown={(e) => {
        switch (e.key) {
          case "ArrowRight":
          case "ArrowLeft":
          case "ArrowUp":
          case "ArrowDown":
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
