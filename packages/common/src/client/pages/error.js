"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/material/styles";

const ErrorContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
}));

const ErrorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: 600,
  width: "100%",
  background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #ff6b6b, #ff8e8e)",
  },
}));

const ErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(3),
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "50%": {
      transform: "scale(1.1)",
      opacity: 0.8,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
}));

const ErrorTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  background: "linear-gradient(45deg, #ff6b6b, #ff8e8e)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  color: theme.palette.text.secondary,
  textAlign: "center",
  marginBottom: theme.spacing(4),
  lineHeight: 1.6,
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
}));

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorContainer>
      <ErrorPaper elevation={3}>
        <ErrorIcon />
        <ErrorTitle variant="h1">エラーが発生しました</ErrorTitle>
        <ErrorMessage variant="body1">
          申し訳ありませんが、予期せぬエラーが発生しました。
          <br />
          ページを更新するか、ホームに戻ってください。
        </ErrorMessage>
        <ButtonContainer>
          <StyledButton
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => reset()}
            sx={{
              background: "linear-gradient(45deg, #2196F3, #21CBF3)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2, #1E88E5)",
              },
            }}
          >
            再試行
          </StyledButton>
          <StyledButton
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => router.push("/")}
            sx={{
              borderColor: "#2196F3",
              color: "#2196F3",
              "&:hover": {
                borderColor: "#1976D2",
                color: "#1976D2",
                backgroundColor: "rgba(33, 150, 243, 0.04)",
              },
            }}
          >
            ホームに戻る
          </StyledButton>
        </ButtonContainer>
      </ErrorPaper>
    </ErrorContainer>
  );
}
