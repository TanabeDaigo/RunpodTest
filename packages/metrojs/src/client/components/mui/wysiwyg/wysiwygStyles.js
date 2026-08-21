/**
 * @file wysiwygStyles.js
 * @description ProseMirror / エディタ領域の最低限スタイル
 */

import "prosemirror-view/style/prosemirror.css";

/** @type {import('@mui/system').SxProps} */
export const editorContentSx = {
  "& .ProseMirror": {
    outline: "none",
    minHeight: "inherit",
    padding: "12px 14px",
    "&:focus": {
      outline: "none",
    },
    "& p.is-editor-empty:first-child::before": {
      color: "action.disabled",
      content: "attr(data-placeholder)",
      float: "left",
      height: 0,
      pointerEvents: "none",
    },
  },
};
