/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom IconButton Component                       ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful icon button component built with    ║
 * ║   Material-UI, providing seamless user interaction            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file IconButton.js
 * @description カスタムアイコンボタンコンポーネント
 *
 * Material-UIのIconButtonコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - スタイルの制御
 * - ホバーエフェクトとアニメーション
 * - エラーハンドリング
 * - パフォーマンス最適化
 *
 * @example
 * // 基本的な使用方法
 * <CustomIconButton onClick={handleClick}>
 *   <SearchIcon />
 * </CustomIconButton>
 *
 * // スタイルのカスタマイズ
 * <CustomIconButton
 *   color="primary"
 *   size="large"
 *   sx={{ borderRadius: '50%' }}
 * >
 *   <AddIcon />
 * </CustomIconButton>
 *
 * // 無効化状態
 * <CustomIconButton disabled>
 *   <DeleteIcon />
 * </CustomIconButton>
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";

const log = new logjs("CustomIconButton");

/**
 * アイコンボタンのデフォルトスタイル定義
 * アニメーション、ホバー効果、無効化状態などのスタイルを設定
 *
 * @type {Object}
 */
const _DEFAULT_STYLE = {
  // トランジション効果の設定
  transition: "all 0.3s ease",

  // ホバー時のスタイル
  "&:hover": {
    // アイコンを少し拡大
    transform: "scale(1.1)",
    // 背景色を変更
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },

  // クリック時のスタイル
  "&:active": {
    // アイコンを少し縮小
    transform: "scale(0.95)",
  },

  // 無効化状態のスタイル
  "&.Mui-disabled": {
    // 透明度を下げて無効化状態を表現
    opacity: 0.7,
  },
};

/**
 * カスタムアイコンボタンコンポーネント
 * Material-UIのIconButtonコンポーネントを拡張したカスタムコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Node} props.children - ボタン内に表示するアイコン要素
 * @param {Object} props.sx - スタイルオブジェクト
 * @param {string} props.color - ボタンの色
 * @param {string} props.size - ボタンのサイズ
 * @param {boolean} props.disabled - 無効化状態
 * @param {Function} props.onClick - クリックイベントハンドラー
 * @param {boolean} props.is_debug - デバッグモードフラグ
 * @returns {JSX.Element} カスタマイズされたアイコンボタン
 *
 * @example
 * // 基本的な使用方法
 * <CustomIconButton onClick={handleClick}>
 *   <SearchIcon />
 * </CustomIconButton>
 *
 * // スタイルのカスタマイズ
 * <CustomIconButton
 *   color="primary"
 *   size="large"
 *   sx={{ borderRadius: '50%' }}
 * >
 *   <AddIcon />
 * </CustomIconButton>
 */
const CustomIconButton = (props) => {
  // is_debugを他のプロパティから分離
  const { is_debug, ...restParams } = props;

  // デバッグモード時のログ出力
  if (is_debug) {
    log.debug("IconButton Props:", {
      is_debug,
      ...restParams,
    });
  }

  // デフォルトパラメータとpropsのマージ
  // 優先順位: restParams > iconButton > common
  const { icon, onClick, disabled, color, size, sx, fullWidth, ...rest } = {
    ...default_params.common,
    ...default_params.iconButton,
    ...restParams,
  };

  if (is_debug) {
    log.debug("IconButton Props:", {
      icon,
      onClick,
      disabled,
      color,
      size,
      sx,
      ...rest,
    });
  }

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      color={color}
      size={size}
      sx={{
        ..._DEFAULT_STYLE,
        ...sx,
      }}
      {...rest}
    >
      {icon}
    </IconButton>
  );
};

/**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
CustomIconButton.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "error",
    "warning",
    "info",
    "success",
    "default",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  is_debug: PropTypes.bool,
};

/**
 * デフォルトプロパティの設定
 * コンポーネントのデフォルト値を設定
 *
 * @type {Object}
 */
CustomIconButton.defaultProps = {
  color: "default",
  size: "medium",
  disabled: false,
  is_debug: false,
};

export default CustomIconButton;
