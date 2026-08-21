"use client";
import { useState } from "react";
import { Box, Typography, Paper, Grid, Button, Divider } from "@mui/material";

import { logjs, apijs, providers, hooks } from "@lib/client";
const { useWebAppContext } = providers;
import {
  validationExample,
  validationTest1,
  validationTest2,
  validationTest3,
  validationTest4,
  validationTest5,
  validationTest6,
  validationTest7,
  validationTest8,
  validationTest9,
  validationTest10,
} from "./examples";

const log = new logjs("ValidationPage");

export default function ValidationPage() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};

  const initForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    ipAddress: "",
    money: "",
  };

  const [form, formProps] = hooks.useFormEx(initForm);
  const [errors, validProps] = hooks.useValidationEx(form);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        useValidationEx テスト
      </Typography>

      {/* 基本的な使用方法の説明 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          基本的な使用方法
        </Typography>
        <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationExample}</pre>
      </Paper>

      {/* テストフォーム */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          テストフォーム
        </Typography>
        <Grid container spacing={3}>
          <form>
            <Grid item xs={12}>
              {formProps.input("name", { label: "名前", required: true, error: errors?.name, helperText: errors?.name })}
            </Grid>
            <Grid item xs={12}>
              {formProps.input("email", { label: "メールアドレス", required: true, error: errors?.email, helperText: errors?.email, isMailAddress: true })}
            </Grid>
            <Grid item xs={12}>
              {formProps.input("password", { label: "パスワード", required: true, error: errors?.password, helperText: errors?.password, type: "password" })}
            </Grid>
            <Grid item xs={12}>
              {formProps.input("confirmPassword", { label: "パスワード（確認）", required: true, error: errors?.confirmPassword, helperText: errors?.confirmPassword, type: "password" })}
            </Grid>
            <Grid item xs={12}>
              {formProps.input("ipAddress", { label: "IPアドレス", required: true, error: errors?.ipAddress, helperText: errors?.ipAddress, isIpAddress: true })}
            </Grid>
            <Grid item xs={12}>
              {formProps.input("money", { label: "金額", required: true, error: errors?.money, helperText: errors?.money })}
            </Grid>
            <Grid item xs={12}>
              {formProps.datePicker("from_date", { label: "開始日", required: true, error: errors?.from_date, helperText: errors?.from_date })}
            </Grid>
            <Grid item xs={12}>
              {formProps.datePicker("to_date", { label: "終了日", required: true, error: errors?.to_date, helperText: errors?.to_date })}
            </Grid>
            <Grid item xs={12}>
              {formProps.button("submit", {
                label: "チェック",
                onClick: () => {
                  validProps.clear();
                  validProps.checkNull("name", "名前");
                  validProps.checkNull("email", "メールアドレス");
                  validProps.checkMailAddress("email", "メールアドレス");
                  validProps.checkNull("password", "パスワード");
                  validProps.checkNull("confirmPassword", "パスワード（確認）");
                  validProps.checkPassword("password", "confirmPassword");
                  validProps.checkNull("ipAddress", "IPアドレス");
                  validProps.checkNull("money", "金額");
                  validProps.checkNumber("money", "金額");

                  if (validProps.checkNull("from_date", "開始日") == true && validProps.checkNull("to_date", "終了日") == true) {
                    validProps.checkDateTerm("from_date", "to_date", "日付");
                  }

                  if (validProps.isError()) {
                    actions.showError("エラーがあります");
                    return;
                  }
                  actions.showSuccess("エラーなし！！");
                },
              })}
            </Grid>
          </form>
        </Grid>
      </Paper>

      {/* テストケースの説明 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          テストケース
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                テスト1: 必須チェック
              </Typography>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationTest1}</pre>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                テスト2: メールアドレス形式チェック
              </Typography>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationTest2}</pre>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                テスト3: パスワード一致チェック
              </Typography>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationTest3}</pre>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                テスト4: 数値チェック
              </Typography>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationTest4}</pre>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                テスト5: IPアドレス形式チェック
              </Typography>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationTest5}</pre>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                テスト6: 日付範囲チェック
              </Typography>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationTest6}</pre>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                テスト7: エラー状態の確認
              </Typography>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationTest7}</pre>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                テスト8: エラーのクリア
              </Typography>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationTest8}</pre>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                テスト9: エラーメッセージの取得
              </Typography>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationTest9}</pre>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                テスト10: フォームコンポーネントとの連携
              </Typography>
              <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>{validationTest10}</pre>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
