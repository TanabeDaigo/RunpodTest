"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apijs, logjs } from "@lib/client";
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { filterModelNames, pickPreferredModel } from "../ollamaModels";

const log = new logjs("OllamaModelSelect");
const api = new apijs("api/llm");

/**
 * ollama list（listModels）からモデルを選ぶプルダウン
 *
 * @param {object} props
 * @param {string} props.value
 * @param {(name: string) => void} props.onChange
 * @param {"chat"|"embed"|"all"} [props.kind]
 * @param {boolean} [props.disabled]
 * @param {string} [props.label]
 * @param {string} [props.helperText]
 * @param {boolean} [props.showRefresh]
 * @param {object} [props.sx]
 */
export default function OllamaModelSelect({
  value,
  onChange,
  kind = "chat",
  disabled = false,
  label,
  helperText,
  showRefresh = true,
  sx,
}) {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [defaultChat, setDefaultChat] = useState("");
  const [defaultEmbed, setDefaultEmbed] = useState("");

  const resolvedLabel =
    label ||
    (kind === "embed"
      ? "Embedding モデル（Ollama）"
      : kind === "all"
        ? "Ollama モデル"
        : "生成モデル（Ollama）");

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.post({ mode: "listModels" });
      if (!res?.success) {
        setLoadError(res?.error || "モデル一覧の取得に失敗しました");
        setNames([]);
        return;
      }
      const list = filterModelNames(res.models || [], kind);
      setNames(list);
      setDefaultChat(res.defaultModel || "");
      setDefaultEmbed(res.defaultEmbedModel || "");
    } catch (err) {
      log.error("listModels failed", err);
      setLoadError(err.message || "モデル一覧の取得に失敗しました");
      setNames([]);
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!names.length || !onChange) return;
    if (value && names.includes(value)) return;
    const preferred = kind === "embed" ? defaultEmbed : defaultChat;
    const next = pickPreferredModel(
      names,
      kind === "embed" ? "embed" : "chat",
      preferred,
    );
    if (next) onChange(next);
  }, [names, value, onChange, kind, defaultChat, defaultEmbed]);

  const helper = useMemo(() => {
    if (loadError) return loadError;
    if (helperText) return helperText;
    if (!names.length && !loading) {
      return "モデルがありません。ollama pull 後に再取得してください。";
    }
    if (kind === "chat" && defaultChat) {
      return `env デフォルト: ${defaultChat}（一覧から選択）`;
    }
    if (kind === "embed" && defaultEmbed) {
      return `env デフォルト: ${defaultEmbed}（一覧から選択）`;
    }
    return "ollama list 相当（listModels）";
  }, [loadError, helperText, names.length, loading, kind, defaultChat, defaultEmbed]);

  return (
    <Stack direction="row" spacing={1} alignItems="flex-start" sx={sx}>
      <TextField
        select
        label={resolvedLabel}
        size="small"
        value={names.includes(value) ? value : ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled || loading || names.length === 0}
        helperText={helper}
        error={Boolean(loadError)}
        sx={{ minWidth: 220, flex: 1 }}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      {showRefresh && (
        <Button
          variant="outlined"
          size="small"
          onClick={refresh}
          disabled={disabled || loading}
          sx={{ mt: 0.5, whiteSpace: "nowrap" }}
        >
          再取得
        </Button>
      )}
    </Stack>
  );
}

/**
 * チップ並び。中身は listModels。
 */
export function OllamaModelChips({
  value,
  onChange,
  kind = "chat",
  disabled = false,
  title,
}) {
  const [names, setNames] = useState([]);
  const [defaultChat, setDefaultChat] = useState("");
  const [defaultEmbed, setDefaultEmbed] = useState("");

  const refresh = useCallback(async () => {
    try {
      const res = await api.post({ mode: "listModels" });
      if (!res?.success) return;
      const list = filterModelNames(res.models || [], kind);
      setNames(list);
      setDefaultChat(res.defaultModel || "");
      setDefaultEmbed(res.defaultEmbedModel || "");
    } catch (err) {
      log.error("listModels failed", err);
    }
  }, [kind]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!names.length || !onChange) return;
    if (value && names.includes(value)) return;
    const preferred = kind === "embed" ? defaultEmbed : defaultChat;
    const next = pickPreferredModel(
      names,
      kind === "embed" ? "embed" : "chat",
      preferred,
    );
    if (next) onChange(next);
  }, [names, value, onChange, kind, defaultChat, defaultEmbed]);

  return (
    <Box sx={{ mt: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {title ||
            (kind === "embed"
              ? "インストール済み（Embedding 用）"
              : "インストール済み（Chat 用）")}
        </Typography>
        <Button size="small" onClick={refresh} disabled={disabled}>
          再取得
        </Button>
      </Stack>
      {!names.length ? (
        <Typography variant="caption" color="text.secondary">
          モデル一覧が空です。ollama pull 後に再取得してください。
        </Typography>
      ) : (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {names.map((name) => (
            <Chip
              key={name}
              label={name}
              size="small"
              color={name === value ? "primary" : "default"}
              onClick={() => !disabled && onChange?.(name)}
              disabled={disabled}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
