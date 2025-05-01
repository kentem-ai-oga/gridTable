// GridTable使用イメージの画面

"use client";

import { useReducer } from "react";
import {
  ButtonCell,
  CheckboxCell,
  Column,
  ComplexCellLayout,
  DateCell,
  GridTable,
  InputCell,
  NumberCell,
  STANDARD_CELL_LAYOUT,
  SelectCell,
} from "../grid-table/cell";
import { INITIAL_DATA } from "./data";
import GridTableDescription from "./description";

// 行データの型定義
export type Person = {
  id: number;
  name: string;
  age: number;
  email: string;
  birthDate: string;
  gender: string;
  isActive: boolean;
  consentGiven: boolean;
  status: string;
  lastVisit: string;
  actions: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
    average: number;
  };
};

// GridTableの実装に型は Column<Person> により自動的に定義されるため
// 個別の型定義は不要

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

// カラム定義
const columns: Column<Person>[] = [
  {
    accessorKey: "id",
    header: () => <span>ID</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "number") return null;
      return (
        <NumberCell
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
          value={value}
          onChange={onChange}
          min={1}
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
        <NumberCell
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
          value={value}
          min={0}
          max={150}
          onChange={onChange}
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
    accessorKey: "birthDate",
    header: () => <span>生年月日</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "string") return null;

      return (
        <DateCell
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
          value={value}
          onChange={(newValue: Date | string | null) => {
            // 日付をISOString形式の文字列として保存
            const dateValue =
              newValue instanceof Date
                ? newValue.toISOString().split("T")[0]
                : typeof newValue === "string"
                  ? newValue
                  : null;
            onChange?.(dateValue || "");
          }}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
          displayFormat="YYYY年MM月DD日"
        />
      );
    },
  },
  {
    accessorKey: "lastVisit",
    header: () => <span>最終訪問日</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "string") return null;

      return (
        <DateCell
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
          value={value}
          onChange={(newValue: Date | string | null) => {
            const dateValue =
              newValue instanceof Date
                ? newValue.toISOString().split("T")[0]
                : typeof newValue === "string"
                  ? newValue
                  : null;
            onChange?.(dateValue || "");
          }}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
          displayFormat="YYYY年MM月DD日"
        />
      );
    },
  },
  {
    accessorKey: "gender",
    header: () => <span>性別</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "string") return null;

      const genderOptions = [
        { value: "male", label: "男性" },
        { value: "female", label: "女性" },
        { value: "other", label: "その他" },
        { value: "prefer_not_to_say", label: "回答しない" },
      ];

      return (
        <SelectCell
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
          value={value}
          onChange={(newValue: string) => onChange?.(newValue)}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
          options={genderOptions}
          placeholder="性別を選択"
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <span>状態</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "string") return null;

      const statusOptions = [
        { value: "active", label: "有効" },
        { value: "pending", label: "保留中" },
        { value: "inactive", label: "無効" },
        { value: "suspended", label: "停止中" },
      ];

      return (
        <SelectCell
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
          value={value}
          onChange={(newValue: string) => onChange?.(newValue)}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
          options={statusOptions}
          placeholder="状態を選択"
        />
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => <span>有効</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "boolean") return null;

      return (
        <CheckboxCell
          ref={(ref) => {
            if (!ref) return;
            onInitialize?.([
              {
                ...STANDARD_CELL_LAYOUT,
                focus: () => ref.focus(),
              },
            ]);
          }}
          className="h-full w-full flex items-center justify-center"
          value={value}
          onChange={(newValue: boolean) => onChange?.(newValue)}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
        />
      );
    },
  },
  {
    accessorKey: "consentGiven",
    header: () => <span>同意</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "boolean") return null;

      return (
        <CheckboxCell
          ref={(ref) => {
            if (!ref) return;
            onInitialize?.([
              {
                ...STANDARD_CELL_LAYOUT,
                focus: () => ref.focus(),
              },
            ]);
          }}
          className="h-full w-full flex items-center justify-center"
          value={value}
          onChange={(newValue: boolean) => onChange?.(newValue)}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
          label="同意済"
        />
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => <span>操作</span>,
    cell: ({ value, onFocus, onKeyDown, onInitialize, rowIndex }) => {
      if (typeof value !== "string") return null;

      const handleClick = () => {
        alert(`行 ${rowIndex + 1} のアクションが実行されました！`);
      };

      let buttonLabel = "表示";
      let variant: "primary" | "secondary" | "danger" = "primary";

      if (value === "edit") {
        buttonLabel = "編集";
        variant = "secondary";
      } else if (value === "delete") {
        buttonLabel = "削除";
        variant = "danger";
      }

      return (
        <ButtonCell
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
          value={value}
          label={buttonLabel}
          variant={variant}
          onClick={handleClick}
          onFocus={() => onFocus?.(STANDARD_CELL_LAYOUT)}
          onKeyDown={onKeyDown}
        />
      );
    },
  },
  {
    accessorKey: "bloodPressure",
    header: () => {
      // 血圧セルのヘッダー定義
      const structure = {
        rows: 2,
        columns: 3, // 3列のグリッド
        columnSizes: ["1fr", "1fr", "1fr"],
        dividerSize: 1,
      };

      const headerCells = [
        // 血圧上
        {
          rowStart: 0,
          columnStart: 0,
          content: "血圧上",
          className: "p-1",
        },
        // 血圧下
        {
          rowStart: 1,
          columnStart: 0,
          content: "血圧下",
          className: "p-1",
        },
        // 血圧平均 (2列分の幅を使用)
        {
          rowStart: 0,
          columnStart: 1,
          rowSpan: 2,
          columnSpan: 2,
          content: "血圧平均",
          className: "p-1 flex items-center justify-center",
        },
      ];

      return (
        <ComplexCellLayout
          structure={structure}
          cells={headerCells}
          className="h-full w-full"
        />
      );
    },
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      // 値が血圧データでない場合は何も表示しない
      if (!isBloodPressure(value)) return null;

      const { systolic, diastolic, average } = value;

      // セルのグリッド構造定義
      const structure = {
        rows: 2,
        columns: 3,
        columnSizes: ["1fr", "1fr", "1fr"],
        dividerSize: 1,
      };
      // レイアウト定義 (フォーカスナビゲーション用)
      // セルのレイアウト位置と一致させる
      const cellLayouts = [
        { topRow: 0, leftColumn: 0, bottomRow: 0.5, rightColumn: 0.5 }, // 血圧上
        { topRow: 0.5, leftColumn: 0, bottomRow: 1, rightColumn: 0.5 }, // 血圧下
        { topRow: 0, leftColumn: 0.5, bottomRow: 1, rightColumn: 1 }, // 血圧平均
      ];

      // フォーカス管理用の参照
      type RefHolder = { focus: () => void };
      const focusRefs: Array<RefHolder | null> = [null, null, null];
      const refsInitialized = [false, false, false];

      // すべての参照が初期化されたかチェック
      const checkAllRefsInitialized = () => {
        if (refsInitialized.every((initialized) => initialized)) {
          const cells = cellLayouts.map((layout, i) => ({
            ...layout,
            focus: () => focusRefs[i]?.focus(),
          }));
          onInitialize?.(cells);
        }
      };

      // 実際のセル要素を定義
      const cellDefinitions = [
        // 血圧上
        {
          rowStart: 0,
          columnStart: 0,
          content: (
            <NumberCell
              ref={(ref) => {
                if (!ref) return;
                focusRefs[0] = { focus: () => ref.focus() };
                refsInitialized[0] = true;
                checkAllRefsInitialized();
              }}
              className="h-full w-full p-1"
              value={systolic}
              min={0}
              max={300}
              onChange={(newValue) => {
                onChange?.({
                  ...value,
                  systolic: newValue,
                });
              }}
              onFocus={() => onFocus?.(cellLayouts[0])}
              onKeyDown={onKeyDown}
            />
          ),
        },
        // 血圧下
        {
          rowStart: 1,
          columnStart: 0,
          content: (
            <NumberCell
              ref={(ref) => {
                if (!ref) return;
                focusRefs[1] = { focus: () => ref.focus() };
                refsInitialized[1] = true;
                checkAllRefsInitialized();
              }}
              className="h-full w-full p-1"
              value={diastolic}
              min={0}
              max={200}
              onChange={(newValue) => {
                onChange?.({
                  ...value,
                  diastolic: newValue,
                });
              }}
              onFocus={() => onFocus?.(cellLayouts[1])}
              onKeyDown={onKeyDown}
            />
          ),
        },
        // 血圧平均
        {
          rowStart: 0,
          columnStart: 1,
          rowSpan: 2,
          columnSpan: 2,
          content: (
            <NumberCell
              ref={(ref) => {
                if (!ref) return;
                focusRefs[2] = { focus: () => ref.focus() };
                refsInitialized[2] = true;
                checkAllRefsInitialized();
              }}
              className="h-full w-full p-1"
              value={average}
              min={0}
              max={200}
              onChange={(newValue) => {
                onChange?.({
                  ...value,
                  average: newValue,
                });
              }}
              onFocus={() => onFocus?.(cellLayouts[2])}
              onKeyDown={onKeyDown}
            />
          ),
        },
      ];

      return (
        <ComplexCellLayout
          structure={structure}
          cells={cellDefinitions}
          className="h-full w-full"
        />
      );
    },
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
  | { rowIndex: number; accessorKey: "isActive"; value: Person["isActive"] }
  | {
      rowIndex: number;
      accessorKey: "consentGiven";
      value: Person["consentGiven"];
    }
  | { rowIndex: number; accessorKey: "status"; value: Person["status"] }
  | { rowIndex: number; accessorKey: "lastVisit"; value: Person["lastVisit"] }
  | { rowIndex: number; accessorKey: "actions"; value: Person["actions"] }
  | {
      rowIndex: number;
      accessorKey: "bloodPressure";
      value: Person["bloodPressure"];
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
      case "gender":
      case "status":
      case "lastVisit":
      case "actions": {
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
      case "isActive":
      case "consentGiven": {
        if (typeof value === "boolean") {
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
      default:
        break;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl mb-5 font-bold text-gray-800">作業員名簿</h1>

      <GridTable<Person>
        columns={columns}
        data={formState}
        onChange={handleChange}
        className="w-full"
      />

      <GridTableDescription />
    </div>
  );
}
