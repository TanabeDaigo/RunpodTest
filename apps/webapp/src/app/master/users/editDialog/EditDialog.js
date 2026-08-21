import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper, Box, Typography, IconButton, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEditDialog } from "./useEditDialog";
import { logjs, hooks, providers } from "@lib/client";

const { useWebAppContext } = providers;

const log = new logjs("master/users/editDialog/EditDialog");

/**
 * ユーザー編集ダイアログコンポーネント
 * 新規作成・編集の両方に対応
 * @param {Object} props - コンポーネントのプロパティ
 * @param {boolean} props.open - ダイアログの表示状態
 * @param {Function} props.onClose - ダイアログを閉じる際のコールバック関数
 * @param {Object} props.params - パラメータ（user_id, is_new等）
 */
function EditDialog({ open, onClose, params }) {
  log.debug("EditDialog", { open, onClose, params });

  // パラメータからuser_idとis_newを取得
  const { user_id, is_new, title } = params;

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">ユーザー{title}</Typography>
          {/* ダミーデータ登録ボタン（開発用） */}
          {formProps.button("dummy", {
            children: "ダミー登録",
            fullwidth: false,
            onClick: () => {
              // ダミーデータを設定
              let _form = {
                ...form,
                login_id: "test_user",
                password: "password123",
                last_name: "田中",
                user_name: "太郎",
                katakana_last_name: "タナカ",
                katakana_name: "タロウ",
                mail1: "test@example.com",
                sex: 1,
                date_of_birth: "1990-01-01",
                post_first_no: "100",
                post_last_no: "0001",
                province_id: 13,
                address1: "千代田区",
                address2: "丸の内1-1-1",
                auth: 1,
                status: 0,
                comments: "テストユーザー",
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
        <Grid container spacing={2}>
          {/* 基本情報セクション */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, margin: 1 }}>
              <Typography variant="h6" gutterBottom>
                基本情報
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {formProps.input_login_id({
                    required: true,
                    error: errors?.login_id,
                    helperText: errors?.login_id,
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.input_password({
                    required: true,
                    error: errors?.password,
                    helperText: errors?.password,
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.input_last_name({
                    required: true,
                    error: errors?.last_name,
                    helperText: errors?.last_name,
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.input_user_name({
                    required: true,
                    error: errors?.user_name,
                    helperText: errors?.user_name,
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.input_katakana_last_name({
                    error: errors?.katakana_last_name,
                    helperText: errors?.katakana_last_name,
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.input_katakana_name({
                    error: errors?.katakana_name,
                    helperText: errors?.katakana_name,
                  })}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 連絡先情報セクション */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, margin: 1 }}>
              <Typography variant="h6" gutterBottom>
                連絡先情報
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  {formProps.input_mail1({
                    error: errors?.mail1,
                    helperText: errors?.mail1,
                  })}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {formProps.input_mail2({
                    error: errors?.mail2,
                    helperText: errors?.mail2,
                  })}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {formProps.input_mail3({
                    error: errors?.mail3,
                    helperText: errors?.mail3,
                  })}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 個人情報セクション */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, margin: 1 }}>
              <Typography variant="h6" gutterBottom>
                個人情報
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {formProps.radio_sex()}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.datePicker_date_of_birth({
                    error: errors?.date_of_birth,
                    helperText: errors?.date_of_birth,
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.input_blood_type({
                    error: errors?.blood_type,
                    helperText: errors?.blood_type,
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.input_birthplace({
                    error: errors?.birthplace,
                    helperText: errors?.birthplace,
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.input_nationality({
                    error: errors?.nationality,
                    helperText: errors?.nationality,
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.input_nearest_station({
                    error: errors?.nearest_station,
                    helperText: errors?.nearest_station,
                  })}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 住所情報セクション */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, margin: 1 }}>
              <Typography variant="h6" gutterBottom>
                住所情報
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  {formProps.input_post_first_no({
                    error: errors?.post_first_no,
                    helperText: errors?.post_first_no,
                  })}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {formProps.input_post_last_no({
                    error: errors?.post_last_no,
                    helperText: errors?.post_last_no,
                  })}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {formProps.input_province_id({
                    error: errors?.province_id,
                    helperText: errors?.province_id,
                  })}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {formProps.input_address1({
                    error: errors?.address1,
                    helperText: errors?.address1,
                  })}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {formProps.input_address2({
                    error: errors?.address2,
                    helperText: errors?.address2,
                  })}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {formProps.input_address3({
                    error: errors?.address3,
                    helperText: errors?.address3,
                  })}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 職務情報セクション */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, margin: 1 }}>
              <Typography variant="h6" gutterBottom>
                職務情報
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {formProps.input_official_position({
                    error: errors?.official_position,
                    helperText: errors?.official_position,
                  })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {formProps.input_department({
                    error: errors?.department,
                    helperText: errors?.department,
                  })}
                </Grid>
                <Grid item xs={12}>
                  {formProps.input_organization({
                    error: errors?.organization,
                    helperText: errors?.organization,
                  })}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 権限・ステータスセクション */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, margin: 1 }}>
              <Typography variant="h6" gutterBottom>
                権限・ステータス
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {formProps.radio_auth()}
                </Grid>
                <Grid item xs={12}>
                  {formProps.input_comments({
                    sx: {
                      minHeight: "40px",
                    },
                    error: errors?.comments,
                    helperText: errors?.comments,
                  })}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
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
              validProps.checkNull("login_id", "ログインID");
              validProps.checkNull("password", "パスワード");
              validProps.checkNull("last_name", "姓");
              validProps.checkNull("user_name", "ユーザー名");

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
