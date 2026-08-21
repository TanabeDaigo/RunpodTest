/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Pagination Component                       ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful pagination component built with     ║
 * ║   Material-UI Pagination, providing seamless pagination       ║
 * ║   handling experience                                         ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * カスタムページネーションコンポーネント
 *
 * Material-UIのPaginationコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - スタイルの制御
 * - イベントハンドリング
 * - カスタマイズ可能な設定
 * - VirtualizedTableと同様のインターフェイス
 *
 * @component
 * @param {Object} props - コンポーネントのプロパティ
 * @param {number} props.count - 総ページ数
 * @param {number} props.page - 現在のページ番号（1ベース）
 * @param {number} props.pageSize - 1ページあたりのアイテム数
 * @param {number} props.total - 総アイテム数
 * @param {Function} props.onPageChange - ページ変更イベントハンドラ
 * @param {Function} props.onPageSizeChange - ページサイズ変更イベントハンドラ
 * @param {boolean} props.showFirstButton - 最初のページボタンの表示
 * @param {boolean} props.showLastButton - 最後のページボタンの表示
 * @param {boolean} props.showPrevButton - 前のページボタンの表示
 * @param {boolean} props.showNextButton - 次のページボタンの表示
 * @param {string} props.variant - ページネーションのバリアント
 * @param {string} props.color - ページネーションの色
 * @param {string} props.size - ページネーションのサイズ
 * @param {Object} props.sx - スタイルオブジェクト
 * @param {boolean} props.disabled - 無効化状態
 * @param {boolean} props.hideNextButton - 次のページボタンを非表示
 * @param {boolean} props.hidePrevButton - 前のページボタンを非表示
 * @param {number} props.siblingCount - 現在のページの前後に表示するページ数
 * @param {number} props.boundaryCount - 最初と最後に表示するページ数
 * @param {boolean} props.is_debug - デバッグモード
 * @returns {JSX.Element} カスタマイズされたページネーション
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import { Pagination, Box, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

import logjs from "@metrojs/logjs";

const log = new logjs("Pagination");

// デフォルトパラメータ
const default_params = {
  common: {
    variant: "outlined",
    color: "primary",
    disabled: false,
    size: "small",
    margin: "dense",
  },
  pagination: {
    showFirstButton: true,
    showLastButton: true,
    showPrevButton: true,
    showNextButton: true,
    variant: "text",
    color: "primary",
    size: "small",
    disabled: false,
    hideNextButton: false,
    hidePrevButton: false,
    siblingCount: 1,
    boundaryCount: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100],
    showPageSizeSelector: true,
    sx: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: 1,
      backgroundColor: "white",
      //border: "0px solid #e0e0e0",
      //borderRadius: 1,
    },
  },
};

// styled-componentsの定義を修正
const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(10),
  padding: theme.spacing(1),
  backgroundColor: "white",
  flexWrap: "wrap",
}));

const PaginationInfo = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

const PageSizeSelector = styled(FormControl)(({ theme }) => ({
  minWidth: 120,
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
  },
  "& .MuiSelect-select": {
    fontSize: "0.875rem",
  },
}));

const CustomPagination = props => {
  const { is_debug, after_func: _after_func, ...restParams } = props;

  if (is_debug != false) {
    log.debug(`Pagination Props:`, {
      is_debug,
      ...restParams,
    });
  }

  try {
    const {
      page = 1,
      pageSize = 10,
      total = 0,
      onPageChange,
      onPageSizeChange,
      showFirstButton,
      showLastButton,
      showPrevButton,
      showNextButton,
      variant,
      color,
      size,
      disabled,
      hideNextButton,
      hidePrevButton,
      siblingCount,
      boundaryCount,
      showPageSizeSelector,
      pageSizeOptions,
      sx,
      ...rest
    } = {
      ...default_params.common,
      ...default_params.pagination,
      ...restParams,
    };

    const _log = message => {
      if (is_debug) {
        log.debug(`Pagination ${message}`);
      }
    };

    const handlePageChange = (event, newPage) => {
      _log(`Page changed to: ${newPage}`);
      if (onPageChange) {
        onPageChange(newPage);
      }
    };

    const handlePageSizeChange = event => {
      const newPageSize = event.target.value;
      _log(`Page size changed to: ${newPageSize}`);
      if (onPageSizeChange) {
        onPageSizeChange(newPageSize);
      }
    };

    // 総ページ数を計算
    const totalPages = Math.ceil(total / pageSize);

    // 表示範囲の計算
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    // 0件の場合は矢印アイコンを非表示にする
    const shouldHideNavigation = total === 0;

    // MUI Paginationコンポーネントに渡すプロパティのみを抽出
    const paginationProps = {
      count: totalPages,
      page,
      onChange: handlePageChange,
      showFirstButton: shouldHideNavigation ? false : showFirstButton,
      showLastButton: shouldHideNavigation ? false : showLastButton,
      variant,
      color,
      size,
      disabled,
      hideNextButton: shouldHideNavigation ? true : showNextButton === false ? true : hideNextButton,
      hidePrevButton: shouldHideNavigation ? true : showPrevButton === false ? true : hidePrevButton,
      siblingCount,
      boundaryCount,
    };

    // PaginationContainerに渡すプロパティから、Pagination専用プロパティを除外
    const {
      showFirstButton: _showFirstButton,
      showLastButton: _showLastButton,
      showPrevButton: _showPrevButton,
      showNextButton: _showNextButton,
      variant: _variant,
      color: _color,
      size: _size,
      disabled: _disabled,
      hideNextButton: _hideNextButton,
      hidePrevButton: _hidePrevButton,
      siblingCount: _siblingCount,
      boundaryCount: _boundaryCount,
      ...containerProps
    } = rest;

    //<PaginationContainer sx={sx} {...containerProps}>
    return (
      <div>
        <Pagination {...paginationProps} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PaginationInfo>{total > 0 ? `${startItem}-${endItem} / ${total}件` : "0件"}</PaginationInfo>
          {showPageSizeSelector && (
            <PageSizeSelector size={size}>
              <InputLabel>表示件数</InputLabel>
              <Select
                value={pageSize}
                sx={{
                  margin: "dense",
                  "& .MuiSelect-select": {
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                    width: "100%",
                  },
                }}
                variant="standard"
                label="表示件数"
                onChange={handlePageSizeChange}
                disabled={disabled}
                size={size}
                margin="dense"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root": {
                        textAlign: "center",
                        justifyContent: "center",
                        display: "flex",
                        width: "100%",
                      },
                    },
                  },
                }}
              >
                {pageSizeOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </PageSizeSelector>
          )}
        </Box>
      </div>
    );
  } catch (error) {
    log.error("Pagination Error:", error);
    return <div>Pagination Error: {error.message}</div>;
  }
};

CustomPagination.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  showFirstButton: PropTypes.bool,
  showLastButton: PropTypes.bool,
  showPrevButton: PropTypes.bool,
  showNextButton: PropTypes.bool,
  variant: PropTypes.oneOf(["text", "outlined"]),
  color: PropTypes.oneOf(["primary", "secondary", "standard"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  hideNextButton: PropTypes.bool,
  hidePrevButton: PropTypes.bool,
  siblingCount: PropTypes.number,
  boundaryCount: PropTypes.number,
  showPageSizeSelector: PropTypes.bool,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
  is_debug: PropTypes.bool,
  after_func: PropTypes.func,
};

export default CustomPagination;
