"use client";

import { useRef } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { sakuttoColors } from "../sakuttoData";

/**
 * 写真アップロード＋プレビュー
 * @param {{ previewUrl: string | null, onSelect: (file: File | null) => void }} props
 */
export default function PhotoUpload({ previewUrl, onSelect }) {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const file = event.target.files?.[0] || null;
    onSelect(file);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onSelect(null);
  };

  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, color: sakuttoColors.text, fontWeight: 600 }}
      >
        写真
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button
          variant="outlined"
          startIcon={<PhotoCameraOutlinedIcon />}
          onClick={() => inputRef.current?.click()}
          sx={{
            borderColor: sakuttoColors.accent,
            color: sakuttoColors.accent,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              borderColor: sakuttoColors.accent,
              bgcolor: sakuttoColors.accentSoft,
            },
          }}
        >
          画像を選ぶ
        </Button>
        {previewUrl && (
          <Button
            size="small"
            onClick={handleClear}
            sx={{ color: sakuttoColors.textMuted, textTransform: "none" }}
          >
            クリア
          </Button>
        )}
      </Stack>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />
      {previewUrl && (
        <Box
          component="img"
          src={previewUrl}
          alt="選択した写真のプレビュー"
          sx={{
            mt: 2,
            width: "100%",
            maxHeight: 240,
            objectFit: "cover",
            borderRadius: 3,
            border: `1px solid ${sakuttoColors.border}`,
          }}
        />
      )}
    </Box>
  );
}
