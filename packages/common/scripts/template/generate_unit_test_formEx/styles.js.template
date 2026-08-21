"use client";

import styled from "styled-components";
import { createTheme } from "@mui/material/styles";

export const ButtonContainer = styled.div`
  position: "absolute",
  right: 0,
  bottom: 0,
  display: "flex",
  gap: "8px",
  alignItems: "center",
`;

export const TestDialogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 32px;
  background: linear-gradient(135deg, #f6f8fc 0%, #f1f4f9 100%);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const TestDialogCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

export const TestDialogTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #1a1a1a;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

export const TestDialogDescription = styled.div`
  margin-top: 0.5rem;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.5;
`;

export const CodeBlock = styled.pre`
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.5;
  font-family: monospace;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  tab-size: 2;
`;

export const TestDialogHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

export const TestDialogMainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  letter-spacing: -0.02em;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border-radius: 2px;
  }
`;

export const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          marginBottom: "24px",
          fontSize: "1.4rem",
          fontWeight: 600,
        },
        h6: {
          marginBottom: "16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
        },
      },
    },
    MuiPre: {
      styleOverrides: {
        root: {
          backgroundColor: "#f5f5f5",
          padding: "16px",
          borderRadius: "4px",
          overflow: "auto",
          fontFamily: "monospace",
          fontSize: "14px",
          lineHeight: "1.5",
        },
      },
    },
  },
});
