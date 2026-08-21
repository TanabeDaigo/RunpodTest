/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Upload Component                           ║
 * ║   Copyright (c) 2025 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful upload component built with         ║
 * ║   Material-UI, providing seamless user interaction            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file Upload.js
 * @description カスタムアップロードコンポーネント
 *
 * Material-UIのUploadコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - propsの受け渡し
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from "prop-types";
import {Button, Grid, Typography, Box,} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useDropzone } from 'react-dropzone';
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";

const log = new logjs("Upload");

/**
 * CustomUpload コンポーネント
 *
 * ファイルのアップロード UI を提供します。
 * ドラッグ＆ドロップ、クリックでファイル選択、削除ボタンなどを備えます。
 *
 * @param {boolean} is_debug - デバッグログを出力するか（default: false）
 * @param {Object} accept - 受け入れ可能な MIME タイプ（例: { 'text/csv': [] }）
 * @param {string} label - ボタンラベル（default: "アップロード"）
 * @param {Function} onClick - アップロードボタン押下時のコールバック（files配列が引数）
 *
 */

const style = {
  root: {
    width: '100%',
  },
  dropzone: (isDragActive) => ({
    border: '3px dashed #aaa',
    borderRadius: 2,
    p: 4,
    textAlign: 'center',
    cursor: 'pointer',
    bgcolor: isDragActive ? '#f0f0f0' : 'white',
    transition: 'background-color 0.3s',
  }),
  fileList: {
    display: 'flex',
    flexWrap: 'wrap',
    mt: 2,
  },
  fileItem: {
    mr: 2,
    mb: 2,
    position: 'relative',
  },
  fileBox: {
    padding: 1,
    border: '1px solid #ddd',
    borderRadius: 1,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fileName: {
    maxWidth: 300,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    bgcolor: 'white',
    borderRadius: '50%',
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
};

const CustomUpload = (props) => {
  const { is_debug, ...restParams } = props;

  // デバッグモード時のログ出力
  if (is_debug) {
    log.debug("Upload Props:", {
      is_debug,
      ...restParams,
    });
  }

  const {
    accept,
    label,
    onClick,
    multiple,
    maxLength,
    maxFileSize,
    isCsv,
    isImage,
    isAppPdf,
  } = {
    ...default_params.common,
    ...default_params.upload,
    ...restParams,
  };

  const [files, setFiles] = useState([]);
  const fileTypeSettings = {
    csv: {
      accept: { 'text/csv': ['.csv'] },
      isValid: (file) => file.name.toLowerCase().endsWith('.csv'),
      errorMsg: 'CSVファイル（.csv）のみアップロードできます。',
    },
    image: {
      accept: { 'image/*': [] },
      isValid: (file) => file.type.startsWith('image/'),
      errorMsg: '画像ファイル（jpg/png/gifなど）のみアップロードできます。',
    },
    pdf: {
      accept: { 'application/pdf': ['.pdf'] },
      isValid: (file) => file.name.toLowerCase().endsWith('.pdf'),
      errorMsg: 'PDFファイル（.pdf）のみアップロードできます。',
    }
  };
  let fileTypeKey = null;
  if (isCsv) fileTypeKey = 'csv';
  else if (isImage) fileTypeKey = 'image';
  else if (isAppPdf) fileTypeKey = 'pdf';

  const typeConfig = fileTypeSettings[fileTypeKey];
  const effectiveAccept = typeConfig ? typeConfig.accept : accept;

  const handleSet = () => {
    onClick(files);
  };

  const handleRemove = (preview) => {
    setFiles(prev => prev.filter(file => file.preview !== preview));
  };

  const onDrop = useCallback((acceptedFiles) => {
    let filtered = acceptedFiles;
  
    if (typeConfig) {
      filtered = acceptedFiles.filter(typeConfig.isValid);
      if (filtered.length < acceptedFiles.length) {
        return;
      }
    }

    const oversized = filtered.filter(file => file.size > maxFileSize);
    if (oversized.length > 0) {
      alert(`ファイルサイズは${(maxFileSize / 1024 / 1024).toFixed(1)}MB以下にしてください。`);
      return;
    }
  
    const newFiles = filtered.map(file =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
  
    setFiles(prev => {
      const uniqueNewFiles = newFiles.filter(
        file => !prev.some(f => f.name === file.name && f.size === file.size)
      );
      if (prev.length + uniqueNewFiles.length > maxLength) {
        alert(`${maxLength}ファイルまでしかアップロードできません`);
        return prev;
      }
      return [...prev, ...uniqueNewFiles];
    });
  }, [maxLength, typeConfig]);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: effectiveAccept,
    onDrop,
    onDropRejected: (fileRejections) => {
      if (typeConfig) {
        alert(typeConfig.errorMsg);
      } else {
        alert("許可されていないファイル形式です。");
      }
    },
    multiple,
  });

  return (
    <Box sx={style.root}>
      <Box {...getRootProps()} sx={style.dropzone(isDragActive)}>
        <input {...getInputProps()} />
        <AttachFileIcon sx={{ fontSize: 64, color: '#666' }} />
        <Typography variant="body1" mt={2}>
          ファイルをドラッグ＆ドロップするか、ここをクリックしてください
        </Typography>
      </Box>

      {files.length > 0 && (
        <Box sx={style.fileList}>
        {files.map(file => (
          <Box key={file.preview} sx={style.fileItem}>
            <Box sx={style.fileBox}>
              {file.type.startsWith('image/') ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              ) : (
                <Typography
                  variant="caption"
                  textAlign="center"
                  noWrap
                  sx={style.fileName}
                  title={file.name}
                >
                  {file.name}
                </Typography>
              )}
            </Box>

            {/* 削除ボタン */}
            <Box 
             sx={style.removeButton} 
             onClick={() => handleRemove(file.preview)}
             >
              ✕
            </Box>
          </Box>
        ))}
      </Box>
      )}

      <Box mt={2}>
        <Button
          variant="contained"
          onClick={handleSet}
          disabled={files.length === 0}
        >
          {label}
        </Button>
      </Box>
    </Box>
  );
};

  /**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
CustomUpload.propTypes = {
  accept: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  is_debug: PropTypes.bool,
};

export default CustomUpload;