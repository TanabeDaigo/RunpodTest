"use client";
import { createTheme } from "@mui/material/styles";
import baseTheme from "@repo/common/config/muiTheme";

const theme = createTheme({
  ...baseTheme,
  cssVariables: true,
  palette: {
    ...baseTheme.palette,
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    ...baseTheme.typography,
  },
});

export default theme;
