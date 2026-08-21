"use client";

import { styled } from "@mui/material/styles";
import { Typography, Button, Box } from "@mui/material";

/**
 * アプリケーションタイトルのスタイル
 * ダッシュボードのヘッダーに表示されるタイトルコンポーネント
 */
export const AppTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
  fontSize: "1.5rem",
  marginLeft: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

/**
 * アプリケーションロゴのスタイル
 * ヘッダーに表示されるロゴコンポーネント
 */
export const AppLogo = styled("img")(() => ({
  height: "32px",
  width: "auto",
  objectFit: "contain",
}));

/**
 * ツールバーアクションのコンテナ
 * ヘッダーの右側に配置されるアクションボタンのコンテナ
 */
export const ToolbarActions = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

/**
 * ログアウトボタンのスタイル
 * ヘッダーに表示されるログアウトボタン
 */
export const LogoutButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

/**
 * サイドバーフッターのコンテナ
 * サイドバーの下部に表示されるフッターコンテナ
 */
export const SidebarFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: "auto",
}));

/**
 * フッターテキストのスタイル
 * サイドバーフッターに表示されるテキスト
 */
export const FooterText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  marginBottom: theme.spacing(0.5),
}));

/**
 * フッターのコピーライトテキストのスタイル
 * サイドバーフッターに表示されるコピーライトテキスト
 */
export const FooterCopyright = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: "0.75rem",
}));
