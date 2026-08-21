/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

export const styles = {
  LoginContainerDiv: css({
    boxSizing: "border-box",
    "@media screen and (min-width: 601px)": {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      position: "relative",

      "&:before": {
        minHeight: "30px",
      },
      "&:before, &:after": {
        minHeight: "30px",
        content: '""',
        display: "block",
        WebkitBoxFlex: 1,
        boxFlex: 1,
        WebkitFlexGrow: 1,
        flexGrow: 1,
        height: "24px",
      },
    },
  }),

  LoginViewDiv: css({
    boxSizing: "inherit",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
    position: "relative",
    zIndex: 2,

    "@media (min-width: 601px)": {
      width: "450px",
      minHeight: 0,
      borderRadius: "8px",
      border: "1px solid #dadce0",
      display: "block",
      flexShrink: 0,
      margin: "0 auto",
      minHeight: 0,
      transition: "0.2s",
      width: "450px",
    },
  }),

  LoginBoxDiv: css({
    display: "block",
    WebkitBoxFlex: 1,
    boxFlex: 1,
    WebkitFlexGrow: 1,
    flexGrow: 1,
    overflow: "hidden",
    padding: "24px 24px 36px",

    "@media (min-width: 450px)": {
      padding: "48px 40px 36px",
    },
    "@media (min-width: 601px)": {
      height: "auto",
      minHeight: "500px",
      overflowY: "auto",
      WebkitTransition: "0.2s",
      transition: "0.2s",
    },
    "&:before, &:after": {
      boxSizing: "inherit",
    },
  }),

  LoginBodyDiv: css({
    boxSizing: "inherit",
    display: "block",
  }),
  TitleDiv: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "120px",
  }),
};
