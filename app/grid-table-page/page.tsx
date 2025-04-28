// GridTable使用イメージの画面

"use client";

import { useReducer } from "react";
import GridTable, { Column } from "./_components/grid-table";
import InputCell from "./_components/grid-table/cell/input-cell";
import {
  CellLayout,
  STANDARD_CELL_LAYOUT,
} from "./_components/grid-table/types";
import { createCellSplit } from "./_components/grid-table/utils";

// 行データの型定義
type Person = {
  id: number;
  name: string;
  age: number;
  email: string;
  birthDate: string;
  gender: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
    average: number;
  };
  // 複雑なセル分割の例として健康評価を追加
  healthAssessment: {
    physical: number; // 0-100
    mental: number; // 0-100
    social: number; // 0-100
    overall: number; // 0-100
  };
};

// bloodPressureの型ガード関数
const isBloodPressure = (value: unknown): value is Person["bloodPressure"] => {
  if (typeof value !== "object" || value === null) return false;
  if (
    !("systolic" in value) ||
    !("diastolic" in value) ||
    !("average" in value)
  )
    return false;
  if (
    typeof value.systolic !== "number" ||
    typeof value.diastolic !== "number" ||
    typeof value.average !== "number"
  )
    return false;
  return true;
};

// healthAssessmentの型ガード関数
const isHealthAssessment = (
  value: unknown,
): value is Person["healthAssessment"] => {
  if (typeof value !== "object" || value === null) return false;
  if (
    !("physical" in value) ||
    !("mental" in value) ||
    !("social" in value) ||
    !("overall" in value)
  )
    return false;
  if (
    typeof value.physical !== "number" ||
    typeof value.mental !== "number" ||
    typeof value.social !== "number" ||
    typeof value.overall !== "number"
  )
    return false;
  return true;
};

// カラム定義
const columns: Column<Person>[] = [
  {
    accessorKey: "id",
    header: () => <span>ID</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "number") return null;
      return (
        <InputCell
          ref={(ref) => {
            if (!ref) return;
            onInitialize?.([
              {
                ...STANDARD_CELL_LAYOUT,
                focus: () => ref.focus(),
              },
            ]);
          }}
          className="h-full w-full"
          type="number"
          value={value}
          onChange={(newValue) => {
            const valueAsNumber = Number(newValue);
            onChange?.(isNaN(valueAsNumber) ? 0 : valueAsNumber);
          }}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <span>名前</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "string") return null;
      return (
        <InputCell
          ref={(ref) => {
            if (!ref) return;
            onInitialize?.([
              {
                ...STANDARD_CELL_LAYOUT,
                focus: () => ref.focus(),
              },
            ]);
          }}
          className="h-full w-full"
          type="text"
          value={value}
          onChange={(newValue) => onChange?.(newValue)}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
        />
      );
    },
  },
  {
    accessorKey: "age",
    header: () => <span>年齢</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "number") return null;
      return (
        <InputCell
          ref={(ref) => {
            if (!ref) return;
            onInitialize?.([
              {
                ...STANDARD_CELL_LAYOUT,
                focus: () => ref.focus(),
              },
            ]);
          }}
          className="h-full w-full"
          type="number"
          value={value}
          onChange={(newValue) => {
            const valueAsNumber = Number(newValue);
            onChange?.(isNaN(valueAsNumber) ? 0 : valueAsNumber);
          }}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
        />
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <span>メールアドレス</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "string") return null;
      return (
        <InputCell
          ref={(ref) => {
            if (!ref) return;
            onInitialize?.([
              {
                ...STANDARD_CELL_LAYOUT,
                focus: () => ref.focus(),
              },
            ]);
          }}
          className="h-full w-full"
          type="email"
          value={value}
          onChange={(newValue) => onChange?.(newValue)}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
        />
      );
    },
  },
  {
    accessorKey: "bloodPressure",
    header: () => (
      <div className="grid grid-cols-[1fr_1px_1fr] grid-rows-[1fr_1px_1fr] place-items-center">
        <div className="row-start-1 col-start-1 p-1">血圧上</div>
        <div className="row-start-2 col-start-1 border-b border-gray-300 w-full h-full" />
        <div className="row-start-3 col-start-1 p-1">血圧下</div>
        <div className="row-start-1 row-span-3 col-start-2 border-r border-gray-300 w-full h-full" />
        <div className="row-start-1 row-span-3 col-start-3 p-1">血圧平均</div>
      </div>
    ),
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (!isBloodPressure(value)) return null;
      const { systolic, diastolic, average } = value;
      // 特殊な血圧パターン用にカスタムレイアウトを作成

      // まず左側の縦2分割を作成
      const leftCells = createCellSplit({
        direction: "vertical",
        count: 2,
      }).map((cell) => ({
        ...cell,
        rightColumn: 0.5, // 左側部分のみを使用
      }));

      // 右側の全高セルを作成
      const rightCell = {
        topRow: 0,
        leftColumn: 0.5,
        bottomRow: 1,
        rightColumn: 1,
      };

      // すべてのセルを結合
      const cellLayouts = [...leftCells, rightCell];

      // 各セルに対応するfocus関数を格納する配列
      const cells: { layout: CellLayout; focus: () => void }[] =
        cellLayouts.map((layout) => ({
          layout,
          focus: () => {}, // 後で更新
        }));

      // すべてのセルのref設定が完了したかをトラッキングする
      const refsInitialized = [false, false, false];
      const checkAllRefsInitialized = () => {
        if (refsInitialized.every((initialized) => initialized)) {
          // すべてのrefが初期化されたらonInitialize呼び出し
          onInitialize?.(
            cells.map((cell) => ({
              ...cell.layout,
              focus: cell.focus,
            })),
          );
        }
      };

      return (
        <div className="grid grid-cols-[1fr_1px_1fr] grid-rows-[1fr_1px_1fr] place-items-center">
          <InputCell
            ref={(ref) => {
              if (!ref) return;
              cells[0].focus = () => ref.focus();
              refsInitialized[0] = true;
              checkAllRefsInitialized();
            }}
            className="row-start-1 col-start-1 p-1 h-full w-full"
            type="number"
            value={systolic}
            onChange={(newValue) => {
              const valueAsNumber = Number(newValue);
              onChange?.({
                ...value,
                systolic: isNaN(valueAsNumber) ? 0 : valueAsNumber,
              });
            }}
            onFocus={() => onFocus?.(cells[0].layout)}
            onKeyDown={onKeyDown}
          />
          <div className="row-start-2 col-start-1 border-b border-gray-300 w-full h-full" />
          <InputCell
            ref={(ref) => {
              if (!ref) return;
              cells[1].focus = () => ref.focus();
              refsInitialized[1] = true;
              checkAllRefsInitialized();
            }}
            className="row-start-3 col-start-1 p-1 h-full w-full"
            type="number"
            value={diastolic}
            onChange={(newValue) => {
              const valueAsNumber = Number(newValue);
              onChange?.({
                ...value,
                diastolic: isNaN(valueAsNumber) ? 0 : valueAsNumber,
              });
            }}
            onFocus={() => onFocus?.(cells[1].layout)}
            onKeyDown={onKeyDown}
          />
          <div className="row-start-1 row-span-3 col-start-2 border-r border-gray-300 w-full h-full" />
          <InputCell
            ref={(ref) => {
              if (!ref) return;
              cells[2].focus = () => ref.focus();
              refsInitialized[2] = true;
              checkAllRefsInitialized();
            }}
            className="row-start-1 row-span-3 col-start-3 p-1 h-full w-full"
            type="number"
            value={average}
            onChange={(newValue) => {
              const valueAsNumber = Number(newValue);
              onChange?.({
                ...value,
                average: isNaN(valueAsNumber) ? 0 : valueAsNumber,
              });
            }}
            onFocus={() => onFocus?.(cells[2].layout)}
            onKeyDown={onKeyDown}
          />
        </div>
      );
    },
  },
];

// 初期データ
const INITIAL_DATA: Person[] = [
  {
    id: 1,
    name: "John Doe",
    age: 28,
    email: "john@example.com",
    birthDate: "1997-04-10",
    gender: "male",
    bloodPressure: { systolic: 120, diastolic: 80, average: 100 },
    healthAssessment: { physical: 85, mental: 90, social: 75, overall: 83 },
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 34,
    email: "jane@example.com",
    birthDate: "1991-07-22",
    gender: "female",
    bloodPressure: { systolic: 130, diastolic: 85, average: 107.5 },
    healthAssessment: { physical: 92, mental: 88, social: 95, overall: 92 },
  },
  {
    id: 3,
    name: "Sam Johnson",
    age: 45,
    email: "sam@example.com",
    birthDate: "1980-11-15",
    gender: "male",
    bloodPressure: { systolic: 140, diastolic: 90, average: 115 },
    healthAssessment: { physical: 78, mental: 82, social: 70, overall: 77 },
  },
];

// Actionの型（Union型で厳密に型付け）
type Action =
  | { rowIndex: number; accessorKey: "id"; value: Person["id"] }
  | { rowIndex: number; accessorKey: "name"; value: Person["name"] }
  | { rowIndex: number; accessorKey: "age"; value: Person["age"] }
  | { rowIndex: number; accessorKey: "email"; value: Person["email"] }
  | { rowIndex: number; accessorKey: "birthDate"; value: Person["birthDate"] }
  | { rowIndex: number; accessorKey: "gender"; value: Person["gender"] }
  | {
      rowIndex: number;
      accessorKey: "bloodPressure";
      value: Person["bloodPressure"];
    }
  | {
      rowIndex: number;
      accessorKey: "healthAssessment";
      value: Person["healthAssessment"];
    };

export default function GridTablePage() {
  // Reducerを使ったデータ管理
  const [formState, formDispatch] = useReducer(
    (state: Person[], action: Action) =>
      state.map((row, index) => {
        if (index === action.rowIndex) {
          return {
            ...row,
            [action.accessorKey]: action.value,
          };
        }
        return row;
      }),
    INITIAL_DATA,
  );

  // 変更ハンドラ
  const handleChange = ({
    columnAccessorKey,
    rowIndex,
    value,
  }: {
    columnAccessorKey: keyof Person;
    rowIndex: number;
    value: unknown;
  }) => {
    switch (columnAccessorKey) {
      case "id": {
        if (typeof value === "number") {
          formDispatch({
            rowIndex,
            accessorKey: columnAccessorKey,
            value,
          });
        }
        break;
      }
      case "name":
      case "email":
      case "birthDate":
      case "gender": {
        if (typeof value === "string") {
          formDispatch({
            rowIndex,
            accessorKey: columnAccessorKey,
            value,
          });
        }
        break;
      }
      case "age": {
        if (typeof value === "number") {
          formDispatch({
            rowIndex,
            accessorKey: columnAccessorKey,
            value,
          });
        }
        break;
      }
      case "bloodPressure": {
        if (isBloodPressure(value)) {
          formDispatch({
            rowIndex,
            accessorKey: columnAccessorKey,
            value,
          });
        }
        break;
      }
      case "healthAssessment": {
        if (isHealthAssessment(value)) {
          formDispatch({
            rowIndex,
            accessorKey: columnAccessorKey,
            value,
          });
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">GridTableサンプル</h1>
      <GridTable<Person>
        columns={columns}
        data={formState}
        onChange={handleChange}
        title="人物情報"
        className="mb-10"
      />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">機能説明</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>矢印キー: セル間を移動</li>
          <li>Enter: 下のセルに移動（Shift+Enterで上に移動）</li>
          <li>Tab: 右のセルに移動（Shift+Tabで左に移動）</li>
          <li>ダブルクリック: セル編集モード</li>
          <li>Esc: 編集モードを終了</li>
          <li>Ctrl+Z / Command+Z: 入力の取り消し</li>
        </ul>
      </div>
    </div>
  );
}
