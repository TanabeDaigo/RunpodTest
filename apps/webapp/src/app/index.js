"use client";

import * as React from "react";
import { Box, Typography, Container } from "@mui/material";

export default function Home() {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          ホームページ
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          ようこそ
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          このアプリケーションはNext.js 15とMUIを使用して構築されています。
        </Typography>
      </Box>
    </Container>
  );
}
