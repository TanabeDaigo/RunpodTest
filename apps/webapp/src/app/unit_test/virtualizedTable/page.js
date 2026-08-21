"use client";

import React from 'react';
import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, components } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { virtualizedTableExample ,virtualizedTableTest} from "./examples";

const { useWebAppContext } = providers;

  const columns = [
    {
      label: 'No',
      dataKey: 'id',
      width: 50,
      align: 'center',
      onClick: (_, rowData) => {
        const { point_id, name, unit } = rowData;
        alert(`TAG: ${point_id}\n名称: ${name}\n単位: ${unit}`);
      },
    },
    {
      label: 'TAG',
      dataKey: 'point_id',
      width: 500,
      align: 'left',
      threePoint: true,
      onClick: (cellValue) => alert(`TAG: ${cellValue}`),
      autoHeaderAlign:true,
    },
    {
      label: '名称ffffffffffff',
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
      headerAlign: 'flex-start',
    },
  ];

  const defaultSortInfo = {
    dataKey: 'unit',
    desc: false,
  };

function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest({}, state, actions);
  const [data, setData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const sortRef = React.useRef(defaultSortInfo);

  const fetchData = (sortInfo, query = '') => {
  const rowCount = 1000;
  const rows = Array.from({ length: rowCount }, (_, i) => ({
    id      : i,
    point_id: `TAG_${i}_xxxxxxxxxxxxxxxx`,
    name    : `NAME_${i}_yyyyyyyyyyyyyy`,
    unit    : `unit_${i}_zzzzzzzzzzzzzz`,
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

/* 初回ロード時に呼ぶ処理はそのまま */
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

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test VirtualizedTable</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>VirtualizedTableの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{virtualizedTableExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
          <TestDialogTitle>VirtualizedTableテスト</TestDialogTitle>
            <TestDialogDescription>
              {components.VirtualizedTable(settings)}
            </TestDialogDescription>

            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{virtualizedTableTest}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(virtualizedTableTest)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
