/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Not Found Page                                   ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   404 Not Foundページを提供するモジュール                     ║
 * ║   主な機能：                                                  ║
 * ║   - 404エラーページの表示                                     ║
 * ║   - ホームページへのリダイレクト                               ║
 * ║   - レスポンシブデザイン                                      ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button, Container, Typography, Box } from "@mui/material";

/**
 * 404 Not Foundページのメインコンテンツ
 * @returns {JSX.Element} 404ページのコンテンツ
 */
function NotFoundContent() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          ページが見つかりません
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          申し訳ありませんが、お探しのページは存在しないか、移動された可能性があります。
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
        >
          ホームに戻る
        </Button>
      </Box>
    </Container>
  );
}

/**
 * 404 Not Foundページのメインコンポーネント
 * @returns {JSX.Element} 404ページのコンポーネント
 */
export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
