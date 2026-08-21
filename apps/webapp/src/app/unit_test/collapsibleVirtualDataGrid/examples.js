// CollapsibleVirtualDataGridのテストケース
export const collapsibleVirtualDataGridExample = `
// 基本的な設定内容
      components.CollapsibleVirtualTable({
        rawRows,               // 親子構造の元データ（親要素の配列）
        rowHeight,             // 各行（親・子共通）の高さ（px）
        maxHeight,             // 子グリッド部分の最大高さ（スクロール用）
        tableWidth,            // 親行左側のアイコン部分の幅（px）
        tableHeight,           // グリッド全体の高さ（例: '100vh' など）
        parentColumns,         // 親行で表示するカラム定義配列（field, headerName, widthなど）
        childColumns,          // 子グリッドで表示するカラム定義配列
        childrenName,          // 親オブジェクト内の子配列プロパティ名（例: "children"）
        disableColumnMenu,     // 子グリッドのカラムメニュー（フィルター等）を無効にするか
        disableColumnResize,   // 子グリッドのカラムリサイズ機能を無効にするか
        hideFooter,            // 子グリッドのフッター（行数やページネーション）を非表示にするか
        onSortChange,          // 親のカラムヘッダークリック時のソート処理コールバック
        density,               // 子グリッドの行の密度（'standard'|'comfortable'|'compact'）
        iconSize,              // 親行の展開アイコン（矢印）のサイズ（'small'|'medium'など）
        toggleOpen,            // 初期状態で親行を展開（true）か折りたたみ（false）か
        parentHeaderStyle,     // 親グリッドのヘッダーに適用するカスタムスタイル
        parentRowStyle,        // 親グリッドの行に適用するカスタムスタイル
        childHeaderStyle,      // 子グリッドのヘッダーに適用するカスタムスタイル
        childRowStyle,         // 子グリッドの各行に適用するカスタムスタイル
        onShowParentTableRow = (field, row) => row[field],
        onShowChildTableRow = (field, row) => row[field],
      }
    );
`;

export const collapsibleVirtualDataGridTest = `
// 通常のCollapsibleVirtualDataGrid
    // 親＋子の全データ
    const [rawRows, setRawRows] = React.useState([]);
    // ソート状態（どの列がソートされているか）
    const [sortModel, setSortModel] = React.useState({ field: '', sort: false });
  
    // 親データに格納される子データのキー名（[childrenName]）
    const childrenName = 'childrenA'; 
     // データ取得関数
    const getData = () => {
      const rows = [];
      for (let i = 1; i <= 20; i++) {
        const parentId = i * 10;
        const created = new Date(Date.now() - i * 100000000).toISOString().split('T')[0];
        const parent = {
          id: parentId,
          parent: true,
          name: \`Parent \${i}\`,
          created_at: created,
          [childrenName]: [],
        };
        for (let j = 1; j <= 3; j++) {
          parent[childrenName].push({
            id: parentId + j,
            name: \`Child \${i}-\${j}\`,
            message: \`This is child \${i}-\${j}\`,
          });
        }
        rows.push(parent);
      }
      return rows;
    };
    
    // データ取得＋ソート処理
    const fetchData = (field = '', desc = false) => {
      let data = getData();
      if (field) {
        data.sort((a, b) => {
          const aVal = a[field];
          const bVal = b[field];
          if (aVal < bVal) return desc ? 1 : -1;
          if (aVal > bVal) return desc ? -1 : 1;
          return 0;
        });
      }
      setRawRows(data);
      setSortModel({ field, sort: desc });
    };
  
     // 初回マウント時にデータを取得
    React.useEffect(() => {
      fetchData();
    }, []);
  
    // 列ヘッダーをクリックしてソートされた時の処理
    const handleSortChange = (field) => {
      const isSameField = sortModel.field === field;
      const newDesc = isSameField ? !sortModel.sort : false;
      fetchData(field, newDesc);
    };

      components.collapsibleVirtualTable({
        parentColumns:[
          { field: 'id', headerName: 'Id', width: 100 },
          { field: 'name', headerName: 'Name', width: 200 },
          { field: 'created_at', headerName: 'Created', width: 200 },
        ],
        childColumns:[
          { field: 'id', headerName: 'Id', width: 100, align: 'center' },
          { field: 'name', headerName: 'Name', width: 200, headerAlign: 'center' ,},
          { field: 'message', headerName: 'Message', width: 300 ,
            renderCell: (params) => (
              <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
                {params.value}
              </a>
            ),},
        ],
        childrenName:'childrenA',
        rawRows,
        onSortChange: handleSortChange,
        parentHeaderStyle:{
          color: 'secondary.main',
          fontSize: '0.875rem',
          fontWeight: 'bold',
        },
        childHeaderStyle:{
          backgroundColor: '#e0e0e0',
        },
        childRowStyle:{
          color: 'red',
        }
    });
`;