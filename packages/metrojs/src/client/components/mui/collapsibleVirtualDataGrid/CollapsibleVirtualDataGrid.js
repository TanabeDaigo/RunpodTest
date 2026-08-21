'use client';
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AutoSizer } from 'react-virtualized';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";
const log = new logjs("CustomDatagrid");

const StyledBox = styled(Box)(({ theme }) => ({
  height: '100%',
  position: 'relative',
  overflowX: 'hidden',
  overflowY: 'auto',
  '& .parent-row': {
    backgroundColor: '#e4f7fa',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
}));

const CommonBox = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  paddingLeft: theme.spacing(1.5),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  position: 'sticky',
  top: 0,
  zIndex: 20,
  backgroundColor: '#ffffff',
  paddingLeft: theme.spacing(1.5),
}));

const ThreePointBox = styled(Box)(({ }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}));

export const CustomCollapsibleVirtualDataGrid = (props = {}) => {
  const {
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
  } = {
    ...default_params.common,
    ...default_params.collapsibleVirtualDataGrid,
    ...props,
  };

  const [rowIds, setRowIds] = React.useState({});
  const [stickyRow, setStickyRow] = React.useState(null);
  const [sortModel, setSortModel] = React.useState({ field: '', sort: false });
  const containerRef = React.useRef(null);

  const rows = React.useMemo(() => {
    return rawRows.map((parent, i) => {
      const children = (parent[childrenName] || []).map((child, j) => {
        const newChilder = { __Index: `${i}-${j}` };
        for (const col of childColumns) {
          const key = col.field;
          newChilder[key] = onShowChildTableRow(key, child, j);
        }
        return newChilder;
      });

      return {
        ...parent,
        __Index: `${i}`,
        [childrenName]: children,
      };
    });
  }, [rawRows, childColumns, childrenName, onShowChildTableRow]);

  React.useEffect(() => {
    const initial = {};
    rows.forEach((row) => {
      initial[row.__Index] = toggleOpen;
    });
    setRowIds(initial);
  }, [toggleOpen,rawRows]);

  const handleRowToggle = (id) => {
    setRowIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const parentColumnsWidth = parentColumns.reduce((total, col) => total + (col.width || 0), 0);
  const childColumnsWidth = childColumns.reduce((total, col) => total + (col.width || 0), 0);
  const totalWidth = Math.max(parentColumnsWidth, childColumnsWidth);

  // スクロール中の親行の検出
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const parentRows = container.querySelectorAll('.parent-row');
      let topMost = null;
      let topDiff = Infinity;

      parentRows.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const containerTop = container.getBoundingClientRect().top;
        const diff = Math.abs(rect.top - containerTop - rowHeight);

        if (rect.top < containerTop + rowHeight && diff < topDiff) {
          const index = el.getAttribute('data-index');
          const row = rows[index];
          if (row) {
            topMost = row;
            topDiff = diff;
          }
        }
      });

      setStickyRow(topMost);
    };

    const onScroll = () => requestAnimationFrame(handleScroll);
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, [rows, rowHeight]);

  const handleSort = (field) => {
    setSortModel((prev) => {
      let newSort = false;
      if (prev.field === field && !prev.sort) newSort = true;
      else if (prev.field === field && prev.sort) newSort = false;
      return {
        field,
        sort: newSort,
      };
    });

    if (onSortChange) {
      onSortChange(field);
    }

    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const styledChildColumns = childColumns.map((col) => ({
    ...col,
    headerClassName: 'custom-child-header',
    cellClassName: 'custom-child-cell',
  }));

  return (
    <div style={{ height: tableHeight, minWidth: totalWidth }}>
      <AutoSizer>
        {({ height ,width}) => (
          <StyledBox ref={containerRef} sx={{ height, minWidth: totalWidth }}>
            <Box sx={{ minWidth: totalWidth ,}}>
            {/* 親のヘッダー */}
            <HeaderBox
              sx={{height: rowHeight}}
            >
              <Box sx={{ width: tableWidth }} />
              {parentColumns.map((col) => (
                <Box
                  key={col.field}
                  sx={{
                    width: col.width,
                    fontWeight: 'bold',
                    pr: 2,
                    cursor: 'pointer',
                    ...parentHeaderStyle,
                  }}
                  onClick={() => handleSort(col.field)}
                >
                  {col.headerName}
                  {sortModel.field === col.field && (sortModel.sort ? ' ↓' : ' ↑')}
                </Box>
              ))}
            </HeaderBox>

            {/* 固定された親行 */}
            {stickyRow && (
              <CommonBox
                className="parent-row"
                sx={{
                  position: 'sticky',
                  top: rowHeight,
                  zIndex: 10,
                  height: rowHeight,
                  ...parentRowStyle,
                }}
                onClick={() => handleRowToggle(stickyRow.__Index)}
              >
                <Box sx={{ width: tableWidth }}>
                  <IconButton
                    size={iconSize}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowToggle(stickyRow.__Index);
                    }}
                  >
                    {rowIds[stickyRow.__Index] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                  </IconButton>
                </Box>
                {parentColumns.map((col) => (
                  <ThreePointBox
                  key={col.field}
                  sx={{width: col.width}}
                  >
                  {onShowParentTableRow(col.field, stickyRow)}
                  </ThreePointBox>
                ))}
              </CommonBox>
            )}

            {/* 親と子を表示 */}
            {rows.map((row) => (
              <React.Fragment key={row.__Index}>
                <CommonBox
                  className="parent-row"
                  data-index={row.__Index}
                  onClick={() => handleRowToggle(row.__Index)}
                  sx={{
                    height: rowHeight,
                    ...parentRowStyle
                  }}
                >
                  <Box sx={{ width: tableWidth }}>
                    <IconButton
                      size={iconSize}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowToggle(row.__Index);
                      }}
                    >
                      {rowIds[row.__Index] ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                    </IconButton>
                  </Box>
                  {parentColumns.map((col) => (
                    <ThreePointBox 
                    key={col.field} 
                    sx={{width: col.width}}
                    >
                       {onShowParentTableRow(col.field, row)}
                    </ThreePointBox>
                  ))}
                </CommonBox>

                {rowIds[row.__Index] && row[childrenName] && (
                  <Box
                    sx={{
                      p: 1,
                      height: Math.min(Math.max(row[childrenName].length, 1) * rowHeight + 56, maxHeight),
                      overflowX: "hidden",
                      }}>
                    <DataGrid
                      rows={row[childrenName]}
                      columns={styledChildColumns}
                      hideFooter={hideFooter}
                      disableColumnMenu={disableColumnMenu}
                      disableColumnResize={disableColumnResize}
                      getRowId={(row) => row.__Index}
                      rowHeight={rowHeight}
                      density={density}
                      getRowClassName={() => 'custom-child-row'}
                      sx={{
                        '& .custom-child-header': {
                          ...childHeaderStyle,
                        },
                        '& .custom-child-cell': {
                          ...childRowStyle,
                        },
                        '& .custom-child-row': {
                          ...childRowStyle,
                        },
                      }}
                    />
                  </Box>
                )}
              </React.Fragment>
            ))}
            </Box>
          </StyledBox>
        )}
      </AutoSizer>
    </div>
  );
};

export default CustomCollapsibleVirtualDataGrid;
