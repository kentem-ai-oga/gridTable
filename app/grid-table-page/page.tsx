// GridTable使用イメージの画面

"use client";

import { ReactNode, useReducer } from "react";
import GridTable, {
  Cell,
  CELL_WITHOUT_SUBCELL,
} from "./_components/grid-table";
import InputCell from "./_components/grid-table/input-cell";

type Person = {
  id: number;
  name: string;
  age: number;
  email: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
    average: number;
  };
};

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

const columns: {
  accessorKey: keyof Person;
  header: ({
    columnAccessorKey,
    callbackFn,
  }: {
    columnAccessorKey: keyof Person;
    callbackFn?: (value: unknown) => void;
  }) => ReactNode;
  cell: ({
    rowIndex,
    columnAccessorKey,
    value,
    onChange,
    onFocus,
    onInitialize,
    onKeyDown,
  }: {
    rowIndex: number;
    columnAccessorKey: keyof Person;
    value: unknown;
    onChange?: (value: unknown) => void;
    onFocus?: (cell: Omit<Cell, "focus">) => void;
    onInitialize?: (subCells: Cell[]) => void;
    onKeyDown?: (key: "up" | "down" | "left" | "right") => void;
  }) => ReactNode;
}[] = [
  {
    accessorKey: "id",
    header: () => <span>ID</span>,
    cell: ({ value, onChange, onFocus, onKeyDown, onInitialize }) => {
      if (typeof value !== "number") return null;
      return (
        <InputCell
          // refCallbackを使うことで、レンダリングされた直後に一度だけこのセルにフォーカスするための関数を取得する
          ref={(ref) => {
            if (!ref) return;
            onInitialize?.([
              {
                ...CELL_WITHOUT_SUBCELL,
                focus: () => ref.focus(),
              },
            ]);
          }}
          className="h-full"
          type="number"
          value={value}
          onChange={(newValue) => {
            const valueAsNumber = Number(newValue);
            if (isNaN(valueAsNumber)) {
              onChange?.(0);
              return;
            }
            onChange?.(valueAsNumber);
          }}
          onFocus={() => onFocus?.(CELL_WITHOUT_SUBCELL)}
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
                ...CELL_WITHOUT_SUBCELL,
                focus: () => ref.focus(),
              },
            ]);
          }}
          className="h-full"
          type="text"
          value={value}
          onChange={(newValue) => onChange?.(newValue)}
          onFocus={() => onFocus?.(CELL_WITHOUT_SUBCELL)}
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
                ...CELL_WITHOUT_SUBCELL,
                focus: () => ref.focus(),
              },
            ]);
          }}
          className="h-full"
          type="number"
          value={value}
          onChange={(newValue) => {
            const valueAsNumber = Number(newValue);
            if (isNaN(valueAsNumber)) {
              onChange?.(0);
              return;
            }
            onChange?.(valueAsNumber);
          }}
          onFocus={() => onFocus?.(CELL_WITHOUT_SUBCELL)}
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
                ...CELL_WITHOUT_SUBCELL,
                focus: () => ref.focus(),
              },
            ]);
          }}
          className="h-full"
          type="email"
          value={value}
          onChange={(newValue) => onChange?.(newValue)}
          onFocus={() => onFocus?.(CELL_WITHOUT_SUBCELL)}
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

      // セル内でサブセルを分けるために、分割している
      const subCells: [Cell, Cell, Cell] = [
        {
          topRow: 0,
          leftColumn: 0,
          bottomRow: 1 / 2,
          rightColumn: 1 / 2,
          focus: () => {},
        },
        {
          topRow: 1 / 2,
          leftColumn: 0,
          bottomRow: 1,
          rightColumn: 1 / 2,
          focus: () => {},
        },
        {
          topRow: 0,
          leftColumn: 1 / 2,
          bottomRow: 1,
          rightColumn: 1,
          focus: () => {},
        },
      ];

      return (
        <div className="grid grid-cols-[1fr_1px_1fr] grid-rows-[1fr_1px_1fr] place-items-center">
          <InputCell
            ref={(ref) => {
              if (!ref) return;
              subCells[0].focus = () => ref.focus();
              onInitialize?.(subCells); // 本当は3つ揃ってからで良い
            }}
            className="row-start-1 col-start-1 p-1 h-full"
            type="number"
            value={systolic}
            onChange={(newValue) => {
              const valueAsNumber = Number(newValue);
              if (isNaN(valueAsNumber)) {
                onChange?.({
                  ...value,
                  systolic: 0,
                });
                return;
              }
              onChange?.({
                ...value,
                systolic: valueAsNumber,
              });
            }}
            onFocus={() => onFocus?.(subCells[0])}
            onKeyDown={onKeyDown}
          />
          <div className="row-start-2 col-start-1 border-b border-gray-300 w-full h-full" />
          <InputCell
            ref={(ref) => {
              if (!ref) return;
              subCells[1].focus = () => ref.focus();
              onInitialize?.(subCells);
            }}
            className="row-start-3 col-start-1 p-1 h-full"
            type="number"
            value={diastolic}
            onChange={(newValue) => {
              const valueAsNumber = Number(newValue);
              if (isNaN(valueAsNumber)) {
                onChange?.({
                  ...value,
                  diastolic: 0,
                });
                return;
              }
              onChange?.({
                ...value,
                diastolic: valueAsNumber,
              });
            }}
            onFocus={() => onFocus?.(subCells[1])}
            onKeyDown={onKeyDown}
          />
          <div className="row-start-1 row-span-3 col-start-2 border-r border-gray-300 w-full h-full" />
          <InputCell
            ref={(ref) => {
              if (!ref) return;
              subCells[2].focus = () => ref.focus();
              onInitialize?.(subCells);
            }}
            className="row-start-1 row-span-3 col-start-3 p-1 h-full"
            type="number"
            value={average}
            onChange={(newValue) => {
              const valueAsNumber = Number(newValue);
              if (isNaN(valueAsNumber)) {
                onChange?.({
                  ...value,
                  average: 0,
                });
                return;
              }
              onChange?.({
                ...value,
                average: valueAsNumber,
              });
            }}
            onFocus={() => onFocus?.(subCells[2])}
            onKeyDown={onKeyDown}
          />
        </div>
      );
    },
  },
];

const INITIAL_DATA = [
  {
    id: 1,
    name: "John Doe",
    age: 28,
    email: "john@example.com",
    bloodPressure: { systolic: 120, diastolic: 80, average: 100 },
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 34,
    email: "jane@example.com",
    bloodPressure: { systolic: 130, diastolic: 85, average: 107.5 },
  },
  {
    id: 3,
    name: "Sam Johnson",
    age: 45,
    email: "sam@example.com",
    bloodPressure: { systolic: 140, diastolic: 90, average: 115 },
  },
] as const satisfies Person[];

type Action =
  | { rowIndex: number; accessorKey: "id"; value: Person["id"] }
  | {
      rowIndex: number;
      accessorKey: "name";
      value: Person["name"];
    }
  | {
      rowIndex: number;
      accessorKey: "age";
      value: Person["age"];
    }
  | {
      rowIndex: number;
      accessorKey: "email";
      value: Person["email"];
    }
  | {
      rowIndex: number;
      accessorKey: "bloodPressure";
      value: Person["bloodPressure"];
    };

export default function GridTablePage() {
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
      case "name": {
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
      case "email": {
        if (typeof value === "string") {
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
    <GridTable<Person>
      columns={columns}
      formState={formState}
      onChange={handleChange}
    />
  );
}
