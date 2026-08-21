/**
 * @file Wysiwyg.js
 * @description Tiptap ベースの WYSIWYG（MUI ラップ・ツールバー付き）
 *
 * 値の受け渡し: `content` に TipTap JSON または HTML 文字列。変更は
 * `onChange(editor, { json, html })` で通知。
 */

"use client";

import * as React from "react";
import PropTypes from "prop-types";
import { useEditor, EditorContent } from "@tiptap/react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import StrikethroughS from "@mui/icons-material/StrikethroughS";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import FormatQuote from "@mui/icons-material/FormatQuote";
import Title from "@mui/icons-material/Title";
import Undo from "@mui/icons-material/Undo";
import Redo from "@mui/icons-material/Redo";
import Link from "@mui/icons-material/Link";
import FormatUnderlined from "@mui/icons-material/FormatUnderlined";
import FormatAlignLeft from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenter from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRight from "@mui/icons-material/FormatAlignRight";
import Highlight from "@mui/icons-material/Highlight";
import Image from "@mui/icons-material/Image";
import TableChart from "@mui/icons-material/TableChart";
import CheckBox from "@mui/icons-material/CheckBox";
import FormatColorFill from "@mui/icons-material/FormatColorFill";

import { default_params } from "../default_params.js";
import {
  getExtensions,
  getExtensionsDependencyKey,
  WYSIWYG_EXTENSION_KEYS,
} from "./buildExtensions.js";
import { editorContentSx } from "./wysiwygStyles.js";
import logjs from "@metrojs/logjs";

const log = new logjs("Wysiwyg");

const COLOR_SWATCHES = ["#000000", "#e53935", "#1e88e5", "#43a047", "#fb8c00", "#8e24aa"];

/**
 * @param {'std'|'pro'|'custom'} mode
 * @param {string[]} enabledExtensions
 * @returns {Set<string>}
 */
function resolveEnabledKeys(mode, enabledExtensions) {
  if (mode === "pro") {
    return new Set(WYSIWYG_EXTENSION_KEYS);
  }
  if (mode === "custom") {
    return new Set(
      (enabledExtensions || []).filter((k) => WYSIWYG_EXTENSION_KEYS.includes(k)),
    );
  }
  return new Set();
}

function contentEquals(editor, content) {
  if (content === undefined) return true;
  try {
    if (content === null || content === "") {
      const json = editor.getJSON();
      const doc = json?.content;
      return !doc || doc.length === 0;
    }
    if (typeof content === "object") {
      return JSON.stringify(editor.getJSON()) === JSON.stringify(content);
    }
    return editor.getHTML() === content;
  } catch {
    return false;
  }
}

/**
 * @param {import('@tiptap/core').Editor} editor
 * @param {Set<string>} enabled
 */
function WysiwygToolbar({ editor, disabled, enabled }) {
  const [, tick] = React.useReducer((n) => n + 1, 0);

  React.useEffect(() => {
    if (!editor) return undefined;
    const onTx = () => tick();
    editor.on("transaction", onTx);
    return () => {
      editor.off("transaction", onTx);
    };
  }, [editor]);

  if (!editor || editor.isDestroyed) {
    return null;
  }

  const chain = () => editor.chain().focus();
  const run = (fn) => {
    if (disabled) return;
    fn();
  };

  const show = (key) => enabled.has(key);

  const btn = (active) => ({
    color: active ? "primary" : "default",
    size: "small",
    disabled,
  });

  return (
    <Stack
      direction="row"
      spacing={0.25}
      flexWrap="wrap"
      useFlexGap
      alignItems="center"
      sx={{ px: 0.5, py: 0.5, borderBottom: 1, borderColor: "divider", bgcolor: "action.hover" }}
    >
      <Tooltip title="太字">
        <IconButton {...btn(editor.isActive("bold"))} onClick={() => run(() => chain().toggleBold().run())}>
          <FormatBold fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="斜体">
        <IconButton {...btn(editor.isActive("italic"))} onClick={() => run(() => chain().toggleItalic().run())}>
          <FormatItalic fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="取り消し線">
        <IconButton {...btn(editor.isActive("strike"))} onClick={() => run(() => chain().toggleStrike().run())}>
          <StrikethroughS fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="見出し2">
        <IconButton {...btn(editor.isActive("heading", { level: 2 }))} onClick={() => run(() => chain().toggleHeading({ level: 2 }).run())}>
          <Title fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="箇条書き">
        <IconButton {...btn(editor.isActive("bulletList"))} onClick={() => run(() => chain().toggleBulletList().run())}>
          <FormatListBulleted fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="番号付きリスト">
        <IconButton {...btn(editor.isActive("orderedList"))} onClick={() => run(() => chain().toggleOrderedList().run())}>
          <FormatListNumbered fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="引用">
        <IconButton {...btn(editor.isActive("blockquote"))} onClick={() => run(() => chain().toggleBlockquote().run())}>
          <FormatQuote fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="元に戻す">
        <IconButton size="small" disabled={disabled || !editor.can().undo()} onClick={() => run(() => chain().undo().run())}>
          <Undo fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="やり直し">
        <IconButton size="small" disabled={disabled || !editor.can().redo()} onClick={() => run(() => chain().redo().run())}>
          <Redo fontSize="small" />
        </IconButton>
      </Tooltip>

      {enabled.size > 0 && <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />}

      {show("link") && (
        <Tooltip title="リンク">
          <IconButton
            {...btn(editor.isActive("link"))}
            onClick={() =>
              run(() => {
                if (editor.isActive("link")) {
                  chain().unsetLink().run();
                  return;
                }
                const url = typeof window !== "undefined" ? window.prompt("URL を入力") : null;
                if (url) {
                  chain().setLink({ href: url }).run();
                }
              })
            }
          >
            <Link fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {show("underline") && (
        <Tooltip title="下線">
          <IconButton {...btn(editor.isActive("underline"))} onClick={() => run(() => chain().toggleUnderline().run())}>
            <FormatUnderlined fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {show("textAlign") && (
        <>
          <Tooltip title="左揃え">
            <IconButton {...btn(editor.isActive({ textAlign: "left" }))} onClick={() => run(() => chain().setTextAlign("left").run())}>
              <FormatAlignLeft fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="中央">
            <IconButton {...btn(editor.isActive({ textAlign: "center" }))} onClick={() => run(() => chain().setTextAlign("center").run())}>
              <FormatAlignCenter fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="右揃え">
            <IconButton {...btn(editor.isActive({ textAlign: "right" }))} onClick={() => run(() => chain().setTextAlign("right").run())}>
              <FormatAlignRight fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}

      {show("highlight") && (
        <Tooltip title="ハイライト">
          <IconButton {...btn(editor.isActive("highlight"))} onClick={() => run(() => chain().toggleHighlight().run())}>
            <Highlight fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {show("image") && (
        <Tooltip title="画像URL挿入">
          <IconButton
            size="small"
            disabled={disabled}
            onClick={() =>
              run(() => {
                const src = typeof window !== "undefined" ? window.prompt("画像 URL") : null;
                if (src) {
                  chain().setImage({ src }).run();
                }
              })
            }
          >
            <Image fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {show("table") && (
        <Tooltip title="表を挿入 (3x3)">
          <IconButton
            size="small"
            disabled={disabled}
            onClick={() =>
              run(() => {
                chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
              })
            }
          >
            <TableChart fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {show("taskList") && (
        <Tooltip title="タスクリスト">
          <IconButton {...btn(editor.isActive("taskList"))} onClick={() => run(() => chain().toggleTaskList().run())}>
            <CheckBox fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {show("color") &&
        COLOR_SWATCHES.map((c) => (
          <Tooltip title={`色 ${c}`} key={c}>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => run(() => chain().setColor(c).run())}
              sx={{
                minWidth: 28,
                width: 28,
                height: 28,
                p: 0,
                bgcolor: c,
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { opacity: 0.85 },
              }}
            >
              <FormatColorFill sx={{ fontSize: 12, color: "transparent" }} />
            </IconButton>
          </Tooltip>
        ))}
    </Stack>
  );
}

WysiwygToolbar.propTypes = {
  editor: PropTypes.object,
  disabled: PropTypes.bool,
  /** @type {Set<string>} */
  enabled: PropTypes.object.isRequired,
};

const Wysiwyg = (props) => {
  const { is_debug, ...restParams } = props;

  const merged = {
    ...default_params.common,
    ...default_params.wysiwyg,
    ...restParams,
  };

  const {
    mode,
    enabledExtensions,
    placeholder,
    label,
    helperText,
    error,
    disabled,
    fullWidth,
    sx,
    minHeight,
    showToolbar,
    content,
    onChange,
    editorClassName,
  } = merged;

  if (is_debug) {
    log.debug("Wysiwyg props:", { is_debug, ...restParams });
  }

  const extensionsKey = getExtensionsDependencyKey(mode, enabledExtensions, placeholder);
  const extensions = React.useMemo(
    () =>
      getExtensions({
        mode,
        enabledExtensions,
        placeholder,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 安定キーで再計算
    [extensionsKey],
  );

  const enabledKeys = React.useMemo(() => resolveEnabledKeys(mode, enabledExtensions), [mode, enabledExtensions]);

  const editor = useEditor({
    extensions,
    content: content ?? "",
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      if (onChange) {
        onChange(ed, { json: ed.getJSON(), html: ed.getHTML() });
      }
    },
  });

  React.useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  React.useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (contentEquals(editor, content)) return;
    try {
      editor.commands.setContent(content ?? "", false);
    } catch (e) {
      log.error("setContent failed:", e);
    }
  }, [content, editor]);

  const inputId = React.useId();

  return (
    <FormControl
      error={Boolean(error)}
      disabled={disabled}
      fullWidth={fullWidth !== false}
      variant="standard"
      sx={sx}
    >
      {label ? (
        <FormLabel htmlFor={inputId} sx={{ mb: 0.5, display: "block" }}>
          {label}
        </FormLabel>
      ) : null}
      <Paper
        id={inputId}
        variant="outlined"
        sx={{
          borderRadius: 1,
          borderColor: error ? "error.main" : "divider",
          overflow: "hidden",
          ...(fullWidth === false ? { display: "inline-block", width: "100%", maxWidth: "100%" } : {}),
        }}
      >
        {showToolbar ? <WysiwygToolbar editor={editor} disabled={disabled} enabled={enabledKeys} /> : null}
        <Box
          sx={{
            minHeight: minHeight ?? 200,
            ...editorContentSx,
            "& .ProseMirror": {
              ...editorContentSx["& .ProseMirror"],
              minHeight: minHeight ?? 200,
            },
          }}
        >
          <EditorContent editor={editor} className={editorClassName} />
        </Box>
      </Paper>
      {helperText ? (
        <FormHelperText error={Boolean(error)} sx={{ mx: 0 }}>
          {helperText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};

Wysiwyg.propTypes = {
  mode: PropTypes.oneOf(["std", "pro", "custom"]),
  enabledExtensions: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  sx: PropTypes.object,
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showToolbar: PropTypes.bool,
  /** TipTap JSON または HTML 文字列 */
  content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /** @param {import('@tiptap/core').Editor} editor @param {{ json: object, html: string }} payload */
  onChange: PropTypes.func,
  editorClassName: PropTypes.string,
  is_debug: PropTypes.bool,
};

Wysiwyg.defaultProps = {
  is_debug: false,
};

export default Wysiwyg;
