// VirtualizedTableのテストケース
export const virtualizedTableExample = `
// 基本的な設定内容
      components.VirtualizedTable({
        rowHeightRatio,       // 行の高さの倍率
                              //（例: 0.1 = テーブル全体の10%の高さを各行に割り当てる）
        tableHeight,          // テーブル全体の高さ
        selectRowIndex,       // 高さを変更したい選択行（selectRowHeightで変更値を設定）
        selectRowHeight,      // 選択行の高さ
        sortInfo,             // ソート情報
        data,                 // 表示するデータ配列
        columns,              // 列の定義
        onHeaderClick,        // ヘッダークリック時に呼ばれる（ソート切替などに使用）
        onShowTableRow,       // 各行の表示処理（値の加工などに使用）
      });
`;

export const virtualizedTableTest = `
// 通常のVirtualizedTable
  const [data, setData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  // 列の定義
  const columns = [
    {
      label: 'No',
      dataKey: 'id',
      width: 50,
      align: 'center',
      onClick: (_, rowData) => {
        const { point_id, name, unit } = rowData;
        alert(\`TAG: \${point_id},名称: \${name},単位: \${unit}\`);
      },
    },
    {
      label: 'TAG',
      dataKey: 'point_id',
      width: 100,
      align: 'left',
      threePoint: true,
      onClick: (cellValue) => alert(\`TAG: \${cellValue}\`),
    },
    {
      label: '名称',
      dataKey: 'name',
      width: 80,
      lines: 2,
      align: 'left',
      threePoint: true,
    },
    {
      label: '単位',
      dataKey: 'unit',
      width: 150,
      align: 'left',
      threePoint: true,
      lines: 2,
    },
  ];

  const defaultSortInfo = {
    dataKey: 'unit',
    desc: false,
  };

  const sortRef = React.useRef(defaultSortInfo);

  // データ取得＋ソート処理
  const fetchData = (sortInfo, query = '') => {
  const rowCount = 1000;
  const rows = Array.from({ length: rowCount }, (_, i) => ({
    id      : i,
    point_id: \`TAG_\${i}_xxxxxxxxxxxxxxxx\`,
    name    : \`NAME_\${i}_yyyyyyyyyyyyyy\`,
    unit    : \`unit_\${i}_zzzzzzzzzzzzzz\`,
  }));
  let filtered = rows;
  if (query) {
    const q = query.toLowerCase();
    filtered = rows.filter(r =>
      r.point_id.toLowerCase().includes(q) ||
      r.name    .toLowerCase().includes(q) ||
      r.unit    .toLowerCase().includes(q)
    );
  }
  const { dataKey, desc } = sortInfo;
  filtered.sort((a, b) => {
    const aVal = a[dataKey];
    const bVal = b[dataKey];
    if (aVal < bVal) return desc ?  1 : -1;
    if (aVal > bVal) return desc ? -1 :  1;
    return 0;
  });
  setData(filtered);
};

 // 初回マウント時にデータを取得
React.useEffect(() => {
  fetchData(sortRef.current);
}, []);

  const settings = {
    rowHeightRatio: 0.1,
    tableHeight: 600,
    selectRowIndex: 2,
    selectRowHeight: 100,
    sortInfo: sortRef.current,
    data,
    columns,
    onHeaderClick: (newSortInfo) => {
     sortRef.current = newSortInfo;
     fetchData(newSortInfo, searchQuery);
    },
    onShowTableRow: (dataKey, row) =>
      dataKey === 'unit' ? row[dataKey]?.toUpperCase() : row[dataKey],
  };

  components.VirtualizedTable(settings)
  );
}`;