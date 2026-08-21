"use client";

import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button
} from '@mui/material';
import {
  TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription,
  TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer
} from "../styles";
import { useUnitTest } from "../useUnitTest";
import { logjs, providers, components } from "@lib/client";
import { collapsibleVirtualDataGridExample, collapsibleVirtualDataGridTest } from "./examples";

const { useWebAppContext } = providers;
const log = new logjs("TestcollapsibleVirtualDataGrid");

const childrenName = 'childrenA';

function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest({}, state, actions);

  const [rawRows, setRawRows] = React.useState([]);
  const [sortModel, setSortModel] = React.useState({ field: '', sort: false });
  const [allExpanded, setAllExpanded] = React.useState(false);

  const [editingRow, setEditingRow] = React.useState(null);
  const [editingParentIndex, setEditingParentIndex] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const parentColumns = [
    { field: 'id', headerName: 'Id', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'created_at', headerName: 'Created', width: 200 },
    { field: '__edit', headerName: '', width: 80 },
  ];

  const handleEditChild = (childRow, parentRow) => {
    setEditingRow(childRow);
    setEditingParentIndex(parentRow.__Index);
    setDialogOpen(true);
  };

  const childColumns = React.useMemo(() => [
    { field: 'id', headerName: 'Id', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'message', headerName: 'Message', width: 300 },
    {
      field: '__edit', headerName: '', width: 80,
      renderCell: (params) => {
        const parentRow = rawRows.find((p) =>
          p[childrenName]?.some((c) => c.id === params.row.id)
        );
        return (
          <button onClick={(e) => {
            e.stopPropagation();
            handleEditChild(params.row, parentRow);
          }}>
            編集
          </button>
        );
      }
    }
  ], [rawRows]);

  const handleDialogSave = () => {
    if (editingParentIndex === null) {
      // 親の編集（＋子一括編集）
      const updatedRows = rawRows.map((r) =>
        r.__Index === editingRow.__Index ? editingRow : r
      );
      setRawRows(updatedRows);
    } else {
      // 子の編集
      const updatedRows = rawRows.map((parent) => {
        if (parent.__Index !== editingParentIndex) return parent;
        const updatedChildren = parent[childrenName].map((child) =>
          child.id === editingRow.id ? { ...editingRow } : child
        );
        return { ...parent, [childrenName]: updatedChildren };
      });
      setRawRows(updatedRows);
    }
  
    setDialogOpen(false);
    setEditingRow(null);
    setEditingParentIndex(null);
  };

  const handleFieldChange = (field, value) => {
    setEditingRow((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onShowParentTableRow = (field, row) => {
    if (field === '__edit') {
      return (
        <button onClick={(e) => {
          e.stopPropagation();
          setEditingRow({
            ...row,
            [childrenName]: row[childrenName].map(child => ({ ...child }))
          });
          setEditingParentIndex(null);
          setDialogOpen(true);
        }}>
          編集
        </button>
      );
    }
    return row[field];
  };

  const onShowChildTableRow = (field, row) => {
    return row[field];
  };

  const generateMockData = () => {
    const rows = [];
    for (let i = 0; i <= 10; i++) {
      const parentId = i * 10;
      const created = new Date(Date.now() - i * 100000000).toISOString().split('T')[0];
      const parent = {
        id: parentId,
        parent: true,
        name: `Parent ${i}`,
        created_at: created,
        __Index: `${i}`,
        [childrenName]: [],
      };
      for (let j = 1; j <= 3; j++) {
        parent[childrenName].push({
          id: parentId + j,
          name: `Child ${i}-${j}`,
          message: `Message ${i}-${j}`,
        });
      }
      rows.push(parent);
    }
    return rows;
  };

  const fetchMockData = (field = '', desc = false) => {
    let data = generateMockData();
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

  const handleSortChange = (field) => {
    const isSameField = sortModel.field === field;
    const newDesc = isSameField ? !sortModel.sort : false;
    fetchMockData(field, newDesc);
  };

  React.useEffect(() => {
    fetchMockData();
  }, []);

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test CollapsibleVirtualDataGrid</TestDialogMainTitle>
      </TestDialogHeader>
      <TestDialogGrid>
        <TestDialogCard>
          <TestDialogTitle>CollapsibleVirtualDataGridの使用例</TestDialogTitle>
          <TestDialogDescription>
            <CodeBlock>{collapsibleVirtualDataGridExample}</CodeBlock>
          </TestDialogDescription>
        </TestDialogCard>

      </TestDialogGrid>
      <TestDialogGrid>
        <TestDialogCard>
          <TestDialogTitle>テスト</TestDialogTitle>
          {formProps.toggleSwitch("allExpanded", {
            label: "全展開",
            defaultChecked: false,
            after_func: (form) => {
              setAllExpanded(form.allExpanded); 
            }
          })}
          <TestDialogDescription>
            {components.CollapsibleVirtualDataGrid({
              parentColumns,
              childColumns,
              childrenName,
              rawRows,
              toggleOpen: allExpanded,
              onSortChange: handleSortChange,
              parentHeaderStyle: { color: 'blue', fontWeight: 'bold' },
              childHeaderStyle: { backgroundColor: '#f0f0f0' },
              childRowStyle: { color: 'black' },
              onShowParentTableRow:onShowParentTableRow,
              onShowChildTableRow:onShowChildTableRow,
            })}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>編集</DialogTitle>
              <DialogContent>
                {editingRow && (
                  <>
                    <TextField
                      margin="dense"
                      label="名前"
                      fullWidth
                      value={editingRow.name ?? ''}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                    />

                    {editingParentIndex === null ? (
                      <>
                        {/* 親の編集：作成日＋子要素も編集 */}
                        <TextField
                          margin="dense"
                          label="作成日"
                          fullWidth
                          value={editingRow.created_at ?? ''}
                          onChange={(e) => handleFieldChange('created_at', e.target.value)}
                        />
                        {editingRow?.[childrenName]?.map((child, idx) => (
                          <div key={child.id} style={{ marginTop: '1rem', padding: '0.5rem', border: '1px solid #ccc' }}>
                            <div>子 {idx + 1}</div>
                            <TextField
                              label="子の名前"
                              fullWidth
                              margin="dense"
                              value={child.name}
                              onChange={(e) => {
                                const updatedChildren = [...editingRow[childrenName]];
                                updatedChildren[idx].name = e.target.value;
                                setEditingRow(prev => ({ ...prev, [childrenName]: updatedChildren }));
                              }}
                            />
                            <TextField
                              label="子のメッセージ"
                              fullWidth
                              margin="dense"
                              value={child.message}
                              onChange={(e) => {
                                const updatedChildren = [...editingRow[childrenName]];
                                updatedChildren[idx].message = e.target.value;
                                setEditingRow(prev => ({ ...prev, [childrenName]: updatedChildren }));
                              }}
                            />
                          </div>
                        ))}
                      </>
                    ) : (
                      // 子の編集：メッセージのみ
                      <TextField
                        margin="dense"
                        label="メッセージ"
                        fullWidth
                        value={editingRow.message ?? ''}
                        onChange={(e) => handleFieldChange('message', e.target.value)}
                      />
                    )}
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
                <Button variant="contained" onClick={handleDialogSave}>保存</Button>
              </DialogActions>
            </Dialog>
          </TestDialogDescription>
          <TestDialogDescription>
            <CodeBlock>{collapsibleVirtualDataGridTest}</CodeBlock>
            <ButtonContainer>
              {formProps.copyButton(collapsibleVirtualDataGridTest)}
            </ButtonContainer>
          </TestDialogDescription>
        </TestDialogCard>

      </TestDialogGrid>
    </div>
  );
}

export default Page;
