const GridTableDescription = () => {
  return (
    <>
      <div className="mt-12 bg-gray-50 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">機能説明</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "矢印キー", value: "セル間を移動" },
            {
              key: "Enter",
              value: "下のセルに移動（Shift+Enterで上に移動）",
            },
            { key: "Tab", value: "右のセルに移動（Shift+Tabで左に移動）" },
            { key: "F2", value: "セル編集モード" },
            { key: "ダブルクリック", value: "セル編集モード" },
            { key: "Esc", value: "編集モードを終了" },
            { key: "Ctrl+Z / Command+Z", value: "入力の取り消し" },
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-center p-3 bg-white rounded-lg shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)] transition-all duration-300 hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.05),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]"
            >
              <div className="flex-shrink-0 w-8 h-8 mr-3 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <span className="text-sm font-semibold">{index + 1}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{item.key}:</span>{" "}
                <span className="text-gray-600">{item.value}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-12 bg-gray-50 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">セルタイプ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "テキスト入力セル",
              description:
                "基本的なテキスト入力に対応します。数値、メールなどのテキスト入力が可能です。",
              icon: "📝",
            },
            {
              title: "日付入力セル",
              description:
                "日付選択のためのピッカーを提供します。日付のフォーマット表示にも対応。",
              icon: "📅",
            },
            {
              title: "セレクトセル",
              description:
                "ドロップダウンリストから選択肢を選ぶことができます。",
              icon: "📋",
            },
            {
              title: "チェックボックスセル",
              description:
                "真偽値の選択に対応します。スペースキーでトグルできます。",
              icon: "✓",
            },
            {
              title: "ボタンセル",
              description:
                "アクション実行のためのボタンを配置できます。Enter/Spaceキーで実行可能。",
              icon: "🔘",
            },
            {
              title: "複合セル",
              description:
                "複数のセルを組み合わせた複雑なレイアウトにも対応しています。",
              icon: "🧩",
            },
          ].map((cell, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)] transition-all duration-300 hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] hover:translate-y-[-2px]"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl mr-3 shadow-inner">
                  {cell.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  {cell.title}
                </h3>
              </div>
              <p className="text-gray-600 pl-13">{cell.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GridTableDescription;
