'use client';
import * as React from 'react';
import { Column, Table, AutoSizer } from 'react-virtualized';
import { IconButton, Link } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";
const log = new logjs("CustomDatagrid");

const classes = {
  flexContainer: 'ReactVirtualized-flexContainer',
  flexContainerHeader: 'ReactVirtualized-flexContainerHeader',
  tableRowHeader: 'ReactVirtualized-tableRowHeader',
  tableRow: 'ReactVirtualized-tableRow',
  tableRowHover: 'ReactVirtualized-tableRowHover',
  tableCell: 'ReactVirtualized-tableCell',
  noClick: 'ReactVirtualized-noClick',
  selectCell: 'ReactVirtualized-selectCell',
};

const ReactVirtualizedTable = styled('div')(({ theme }) => ({
  [`& .${classes.flexContainer}`]: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  [`& .${classes.flexContainerHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    // borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [`& .${classes.tableRowHeader}`]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [`& .${classes.tableRow}`]: {
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [`& .${classes.tableRowHover}`]: {
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
  },
  [`& .${classes.tableCell}`]: {
    flex: 1,
    padding: '0px',
  },
  [`& .${classes.selectCell}`]: {},
  [`& .${classes.noClick}`]: {
    cursor: 'initial',
  },
}));

const ThreePointText = styled('div')(({ width, lines }) => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: lines,
  overflow: 'hidden',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  width,
}));

const HeaderCell = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isSortable',
})(({ isSortable }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  cursor: isSortable ? 'pointer' : 'default',
  minWidth: 0,
  flex: 1,
}));

const HeaderLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'isSortable',
})(({ isSortable }) => ({
  cursor: isSortable ? 'pointer' : 'default',
  pointerEvents: isSortable ? 'auto' : 'none',
  textDecoration: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const CellDataStyled = styled('div')(({ justifyContent, height }) => ({
  justifyContent,
  height,
  display: 'flex',
  alignItems: 'center',
}));

function createData(columns, data, onShowTableRow) {
  const rows = [];
  for (let index in data) {
    const row = {};
    const target = data[index];
    for (let index2 in columns) {
      const col = columns[index2];
      const dataKey = col.dataKey;
      row[dataKey] = onShowTableRow(dataKey, target, index2);
    }
    rows.push(row);
  }
  return rows;
}

export const CustomVirtualizedTable = (props = {}, is_debug = false) => {
  const {
    columns,
    sortInfo,
    onHeaderClick,
    selectIndex,
    rowHeightRatio,
    tableHeight,
    selectRowIndex,
    selectRowHeight,
    onShowTableRow = (dataKey, row) => row[dataKey],
    data = [],
    headerHeight,
    onRowClick,
    childRowStyle,
  } = {
    ...default_params.common,
    ...default_params.virtualizedTable,
    ...props,
  };

  const rowHeight = ({ index }) => {
    const defaultRowHeight = tableHeight * rowHeightRatio;
    if (index === selectRowIndex) {
      return selectRowHeight
    }
    return defaultRowHeight;
  };

  const newdata = React.useMemo(() => {
    return createData(columns, data, onShowTableRow);
  }, [columns, data]);

  const makeThreePoint = (obj, width, lines) => (
    <ThreePointText width={width} lines={lines}>{obj}</ThreePointText>
  );

  const headerRenderer = ({ dataKey, label, columnIndex }) => {
    const column = columns[columnIndex];
    const isSortable = typeof onHeaderClick === 'function';
    const isSorted = isSortable && sortInfo.dataKey === dataKey;
    const sortIcon = isSorted
      ? sortInfo.desc
        ? <ArrowDropDownIcon fontSize="inherit" />
        : <ArrowDropUpIcon fontSize="inherit" />
      : null;

    let justifyContent;
    if (column.autoHeaderAlign) {
      justifyContent = column.width < 80 ? 'center' : 'flex-start';
    } else if (column.headerAlign) {
      justifyContent = column.headerAlign;
    } else {
      justifyContent = 'center';
    }

    const handleSortClick = (e) => {
      if (!isSortable) return;
      e.preventDefault();
      const newSortInfo = {
        dataKey,
        desc: isSorted ? !sortInfo.desc : true,
      };
      onHeaderClick(newSortInfo);
    };

    return (
      <HeaderCell isSortable={!!onHeaderClick} className={clsx(classes.tableCell, classes.flexContainerHeader)} style={{ justifyContent }}>
        <HeaderLink
          href="#"
          onClick={handleSortClick}
          isSortable={!!onHeaderClick}
        >
          {label}
        </HeaderLink>
        {isSortable && isSorted && (
          <IconButton onClick={handleSortClick} size="small" >
            {sortIcon}
          </IconButton>
        )}
      </HeaderCell>
    );
  };

  const cellRenderer = ({ cellData, columnIndex, rowIndex, rowData }) => {
    const column = columns[columnIndex];
    const isSelected = rowIndex === selectIndex;
    const align = column.align || (column.numeric ? 'right' : 'left');
    const justifyContent = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
    const width = column.width;
    const lines = column.lines ?? 1;
    const content = column.threePoint ? makeThreePoint(cellData, width, lines) : cellData;
    const style = typeof childRowStyle === 'function' ? childRowStyle(rowData) : {};
    const handleClick = (e) => {
      if (column.onClick) {
        column.onClick(cellData, rowData, rowIndex);
      }
    };

    return (
      <CellDataStyled
        justifyContent={justifyContent}
        height={rowHeight({ index: rowIndex })}
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          {
            [classes.noClick]: !column.onClick,
            [classes.selectCell]: isSelected,
          }
        )}
        style={style}
        onClick={handleClick}
      >
        {content}
      </CellDataStyled>
    );
  };

  const getRowClassName = ({ index }) => {
    if (index < 0) {
      return clsx(classes.flexContainerHeader, classes.tableRowHeader);
    }

    // データ行：hover クラス含む
    return clsx(
      classes.tableRow,
      classes.flexContainer,
      classes.tableRowHover
    );
  };
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0) + 15;

  return (
    <ReactVirtualizedTable>
      <div style={{
            height: tableHeight,
            width: tableWidth,
            overflowX: 'auto',
            overflowY: 'hidden',
          }}>
        <AutoSizer>
          {() => (
            <Table
              width={tableWidth}
              height={tableHeight}
              headerHeight={headerHeight}
              rowHeight={rowHeight}
              rowCount={newdata.length}
              rowGetter={({ index }) => newdata && newdata.length > index ? newdata[index] : {}}
              rowClassName={getRowClassName}
              rowStyle={({ index }) => {
                const rowData = data[index];
                if (childRowStyle && typeof childRowStyle === 'function' && rowData) {
                  return childRowStyle(rowData);
                }
                return {};
              }}
              onRowClick={({ rowData }) => {
                onRowClick?.(rowData);
              }}
            >
              {columns.map((column, index) => (
                <Column
                  key={column.dataKey}
                  label={column.label}
                  dataKey={column.dataKey}
                  width={column.width}
                  style={{
                    flex: `0 1 ${column.width}px`,
                    minWidth: column.width,
                    maxWidth: column.width,
                  }}
                  headerStyle={{
                    flex: `0 0 ${column.width}px`,
                    minWidth: column.width,
                    maxWidth: column.width,
                  }}
                  headerRenderer={(headerProps) =>
                    headerRenderer({ ...headerProps, columnIndex: index })
                  }
                  cellRenderer={cellRenderer}
                  cellDataGetter={({ dataKey, rowData }) => rowData[dataKey]}
                  className={classes.flexContainer}
                  headerClassName={classes.flexContainerHeader}
                />
              ))}
            </Table>
          )}
        </AutoSizer>
      </div>
    </ReactVirtualizedTable>
  );
};


export default CustomVirtualizedTable;
