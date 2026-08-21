/**
 * プロジェクト管理ページコンポーネント
 *
 * 以下の機能を提供:
 * - ユーザー認証状態の管理
 * - セッション情報の表示
 * - サインアウト処理
 * - アラートとダイアログの表示
 * - カスタムダイアログの統合
 *
 * @returns {JSX.Element} プロジェクト管理ページのレンダリング結果
 */
"use client";

import { useEffect } from "react";
import { Container, Box } from "@mui/material";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import { Grid, Paper } from "@mui/material";

import { useEditDialog } from "./editDialog/useEditDialog";

import { useProjects } from "./useProjects";
import { providers, logjs, components } from "@lib/client";

const log = new logjs("Projects");

const { useWebAppContext } = providers;

// ページレンダリング
export default function Page() {
  // コンテキストの使用
  const webAppContext = useWebAppContext();
  const { state, actions, params } = webAppContext || {};

  const initState = {
    project_id: "",
    project_name: "",
  };

  const [form, formProps] = useProjects(initState, state, actions);
  const [data, dialogProps] = useEditDialog();
  const { open, onClose, isOpen, renderDialog } = dialogProps;

  log.debug("form", form);
  log.debug("state", state);

  // 初期処理
  useEffect(() => {
    formProps.find();
  }, []);
  // ページタイトルを設定
  useEffect(() => {
    actions.setPageTitle("プロジェクト検索");
  }, [actions]);

  const onShowTableRow = (dataKey, rowData) => {
    if (dataKey === "_edit") {
      return (
        <button
          onClick={() => {
            dialogProps.open({ project_id: rowData.project_id, is_new: false, title: "更新" }, (result) => {
              if (result?.result) {
                formProps.find();
              }
            });
          }}
        >
          <EditDocumentIcon sx={{ color: "grey" }} />
        </button>
      );
    }
    return <div>{rowData[dataKey]}</div>;
  };
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, width: "100%", minWidth: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                {formProps.input_project_id()} {/* プロジェクトID */}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {formProps.input_project_name()} {/* プロジェクト名称 */}
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
              {formProps.button("find", {
                onClick: () => formProps.find(),
                disabled: state.isLoading,
                children: "検索",
              })}
              {formProps.button("reset", {
                onClick: async () => {
                  await formProps.reset();
                },
                children: "リセット",
                disabled: state.isLoading,
              })}
              {formProps.button("new", {
                onClick: () => {
                  open({ title: "新規作成", is_new: true }, (result) => {
                    log.debug("result", result);
                    formProps.find();
                  });
                },
              })}
            </Box>
          </Paper>
        </Grid>
        {renderDialog()}
      </Grid>
      {/* ページネーションコンポーネント */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <components.Pagination {...formProps.makePagination()} showPageSizeSelector={false} is_debug={false} />
      </Grid>
      <Grid item sx={{ width: "100%", height: 600 }}>
        {formProps.makeGrid({
          onShowTableRow,
        })}
      </Grid>
    </Container>
  );
}
