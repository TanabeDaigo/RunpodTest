import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { default_params } from "../default_params.js";

const CustomDownload = (props) => {
  const { is_debug, ...restParams } = props;

  // デバッグモード時のログ出力
  if (is_debug) {
    console.log("Download Props:", {
      is_debug,
      ...restParams,
    });
  }

  const {
    variant,
    label,
    onClick,
    disabled,
  } = {
    ...default_params.common,
    ...default_params.download,
    ...restParams,
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Button
        variant={variant}
        startIcon={<DownloadIcon />}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </Button>
    </Box>
  );
};

export default CustomDownload;
