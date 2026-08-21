"use client";

import { Container, Typography, Box, Paper } from "@mui/material";
import React, { useEffect } from "react";
import { providers } from "@lib/client";
const { useWebAppContext } = providers;
// ページレンダリング
export default function Page() {
  // コンテキストの使用
  const webAppContext = useWebAppContext();
  const { state, actions, params } = webAppContext || {};
  // ページタイトルを設定
  useEffect(() => {
    actions.setPageTitle("Account");
  }, [actions]);
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          アカウント設定
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          このページはアカウント設定ページです。
        </Typography>
      </Box>
    </Container>
  );
}
