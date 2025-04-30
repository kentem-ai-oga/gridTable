// GridTable使用イメージの画面

"use client";

import { useReducer } from "react";
import {
  ButtonCell,
  CellLayout,
  CheckboxCell,
  Column,
  DateCell,
  GridTable,
  InputCell,
  NumberCell,
  STANDARD_CELL_LAYOUT,
  SelectCell,
  createCellSplit,
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
          <NumberCell
            ref={(ref) => {
              if (!ref) return;
              cells[0].focus = () => ref.focus();
              refsInitialized[0] = true;
              checkAllRefsInitialized();
            }}
            className="row-start-1 col-start-1 p-1 h-full w-full"
            value={systolic}
            min={0}
            max={300}
            onChange={(newValue) => {
              onChange?.({
                ...value,
                systolic: newValue,
              });
            }}
            onFocus={() => onFocus?.(cells[0].layout)}
            onKeyDown={onKeyDown}
          />
          <div className="row-start-2 col-start-1 border-b border-gray-300 w-full h-full" />
          <NumberCell
            ref={(ref) => {
              if (!ref) return;
              cells[1].focus = () => ref.focus();
              refsInitialized[1] = true;
              checkAllRefsInitialized();
            }}
            className="row-start-3 col-start-1 p-1 h-full w-full"
            value={diastolic}
            min={0}
            max={200}
            onChange={(newValue) => {
              onChange?.({
                ...value,
                diastolic: newValue,
              });
            }}
            onFocus={() => onFocus?.(cells[1].layout)}
            onKeyDown={onKeyDown}
          />
          <div className="row-start-1 row-span-3 col-start-2 border-r border-gray-300 w-full h-full" />
          <NumberCell
            ref={(ref) => {
              if (!ref) return;
              cells[2].focus = () => ref.focus();
              refsInitialized[2] = true;
              checkAllRefsInitialized();
            }}
            className="row-start-1 row-span-3 col-start-3 p-1 h-full w-full"
            value={average}
            min={0}
            max={200}
            onChange={(newValue) => {
              onChange?.({
                ...value,
                average: newValue,
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
