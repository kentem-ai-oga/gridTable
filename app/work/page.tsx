"use client";

import { useRef } from "react";

export default function WorkPage() {
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <main>
      <h1>Excelのようにセルのフォーカス状態を1段階に分けたい</h1>
      <ul>
        <li>
          1段階目フォーカスでは直接値を入力はできるものの矢印キーでフォーカス移動ができる
        </li>
        <li>
          2段階目フォーカスは値の編集専用のフォーカスで、矢印キーはセル内の操作となる(キャレットの移動)
        </li>
      </ul>
      <h2>2段階のフォーカスを切り分けるためにtabIndexが使えるかどうかの調査</h2>
      <div className="flex flex-col gap-4">
        <div
          ref={divRef}
          tabIndex={0}
          className="border border-blue-500 focus:outline-2 focus:outline-orange-500"
          onClick={() => divRef.current?.focus()}
        >
          <input
            ref={inputRef}
            tabIndex={-1}
            className="border"
            type="text"
            onPointerDown={(e) => e.preventDefault()} // onClickでpreventDefaultをしてもinputにフォーカスが当たってしまうので、onPointerDownでpreventDefaultをする
            onClick={(e) => e.stopPropagation()} // フォーカスが当たっているときにクリックしてもdivにフォーカスが当たらないように
            onDoubleClick={() => inputRef.current?.focus()}
          />
        </div>
        <input className="border" type="text" />
      </div>
    </main>
  );
}
