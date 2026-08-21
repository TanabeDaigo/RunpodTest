import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEditDialog } from "./useEditDialog";
import { logjs, hooks, providers } from "@lib/client";

const { useWebAppContext } = providers;

const log = new logjs("master/projects/editDialog/EditDialog");

/**
 * プロジェクト編集ダイアログコンポーネント
 * 新規作成・編集の両方に対応
 * @param {Object} props - コンポーネントのプロパティ
 * @param {boolean} props.open - ダイアログの表示状態
 * @param {Function} props.onClose - ダイアログを閉じる際のコールバック関数
 * @param {Object} props.params - パラメータ（project_id, is_new等）
 */
function EditDialog({ open, onClose, params }) {
  log.debug("EditDialog", { open, onClose, params });

  // パラメータからproject_idとis_newを取得
  const { project_id, is_new, title } = params;

  // Webアプリケーションのコンテキストを取得
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};

  // 編集ダイアログ用のフォームフックを使用
  const [form, formProps] = useEditDialog(state, actions, params);

  // バリデーション用のフックを使用
  const [errors, validProps] = hooks.useValidationEx(form);

  // 初期処理：新規作成でない場合は既存データを取得
  useEffect(() => {
    if (is_new == true) {
      return;
    }
    formProps.get_one();
  }, []);

  log.debug("errors", errors);
  log.debug("actions", actions);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">プロジェクト{title}</Typography>
          {/* ダミーデータ登録ボタン（開発用） */}
          {formProps.button("dummy", {
            children: "ダミー登録",
            fullwidth: false,
            onClick: () => {
              // ダミーデータを設定
              let _form = {
                ...form,
                project_name: "ぷーさん",
                dbms_id: 1,
                db_server: "133.242.153.47",
                db_port: "237",
                db_name: "project_db",
                db_user: "project",
                db_pass: "@Project1203",
                db_encoding: "UTF8",
                comments: "コメント",
              };
              formProps.setForm({ ..._form });
            },
          })}
          {/* ダイアログを閉じるボタン */}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* プロジェクト名入力フィールド */}
        {formProps.input_project_name({
          required: true,
          error: errors?.project_name,
          helperText: errors?.project_name,
        })}
        {/* データベース設定セクション */}
        <Paper sx={{ padding: 4, margin: 2 }}>
          {/* DBMS選択ラジオボタン */}
          {formProps.radio_dbms()}
          {/* DBサーバー入力フィールド */}
          {formProps.input_db_server({
            required: true,
            error: errors?.db_server,
            helperText: errors?.db_server,
          })}
          {/* DBポート入力フィールド */}
          {formProps.input_db_port({
            required: true,
            error: errors?.db_port,
            helperText: errors?.db_port,
          })}
          {/* DB名入力フィールド */}
          {formProps.input_db_name({
            required: true,
            error: errors?.db_name,
            helperText: errors?.db_name,
          })}
          {/* DBユーザー入力フィールド */}
          {formProps.input_db_user({
            required: true,
            error: errors?.db_user,
            helperText: errors?.db_user,
          })}
          {/* DBパスワード入力フィールド */}
          {formProps.input_db_pass({
            required: true,
            error: errors?.db_pass,
            helperText: errors?.db_pass,
          })}
          {/* DBエンコーディング入力フィールド */}
          {formProps.input_db_encoding({
            required: true,
            error: errors?.db_encoding,
            helperText: errors?.db_encoding,
          })}
          {/* コメント入力フィールド */}
          {formProps.input_comments({
            sx: {
              minHeight: "40px",
            },
            error: errors?.comments,
            helperText: errors?.comments,
          })}
        </Paper>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Box>
          {is_new == false &&
            formProps.button("delete", {
              sx: {
                backgroundColor: "red",
              },
              onClick: async () => {
                const result = await actions.showConfirm("確認", "削除します。よろしいですか？");
                if (!result) {
                  return;
                }
                const res = await formProps.delete_one();
                if (res.result) {
                  actions.showSuccess("削除しました");
                  onClose({ result: true });
                } else {
                  actions.showError(res.error);
                }
              },
            })}
        </Box>
        <Box>
          {/* 保存ボタン */}
          {formProps.button("save", {
            fullwidth: false,
            sx: {
              marginRight: 2,
            },
            disabled: state.isLoading,
            onClick: async () => {
              // バリデーションエラーをクリア
              validProps.clear();
              validProps.setTarget(form);
              log.debug("validProps form", form);

              // 必須項目のバリデーション
              validProps.checkNull("project_name", "プロジェクト名");
              validProps.checkNull("dbms_id", "DBMS");
              validProps.checkNull("db_server", "DBサーバー");
              validProps.checkNull("db_port", "DBポート");
              validProps.checkNull("db_name", "DB名");
              validProps.checkNull("db_user", "DBユーザー");
              validProps.checkNull("db_pass", "DBパスワード");
              validProps.checkNull("db_encoding", "文字コード");

              // バリデーションエラーがある場合は処理を中断
              if (validProps.isError()) {
                // actionsの存在チェックとshowErrorの安全な呼び出し
                if (actions && actions.showError) {
                  actions.showError("エラーがあります");
                } else {
                  console.error("actions.showError is not available");
                }
                return;
              }
              // 保存確認ダイアログを表示
              const result = await actions.showConfirm("確認", "保存しますか？");
              if (!result) {
                return;
              }

              // データを保存
              const res = await formProps.save();
              if (res.result) {
                // actionsの存在チェックとshowSuccessの安全な呼び出し
                if (actions && actions.showSuccess) {
                  actions.showSuccess("保存しました");
                } else {
                  log.debug("保存しました");
                }
                onClose({ result: true });
              } else {
                // actionsの存在チェックとshowErrorの安全な呼び出し
                if (actions && actions.showError) {
                  // res.errorが有効な文字列かチェック
                  const errorMessage = res.error || "保存に失敗しました";
                  actions.showError(errorMessage);
                } else {
                  log.error("保存に失敗しました:", res.error);
                }
              }
            },
          })}
          {/* 閉じるボタン */}
          {formProps.button("close", {
            children: "閉じる",
            fullwidth: false,
            onClick: () => onClose({ result: "close---" }),
          })}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
export default EditDialog;
