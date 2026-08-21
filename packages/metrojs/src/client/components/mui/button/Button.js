/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Button Component                           ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful button component built with         ║
 * ║   Material-UI, providing seamless user interaction            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file Button.js
 * @description カスタムボタンコンポーネント
 *
 * Material-UIのButtonコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - スタイルの制御（改行なしの表示）
 * - ホバーエフェクトとアニメーション
 * - エラーハンドリング
 * - パフォーマンス最適化
 *
 * @example
 * // 基本的な使用方法
 * <CustomButton onClick={handleClick}>
 *   クリックしてください
 * </CustomButton>
 *
 * // スタイルのカスタマイズ
 * <CustomButton
 *   variant="contained"
 *   color="primary"
 *   sx={{ borderRadius: '20px' }}
 * >
 *   カスタムボタン
 * </CustomButton>
 *
 * // 無効化状態
 * <CustomButton disabled>
 *   無効なボタン
 * </CustomButton>
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";
const log = new logjs("CustomButton");

/**
 * ボタンのデフォルトスタイル定義
 * アニメーション、ホバー効果、無効化状態などのスタイルを設定
 *
 * @type {Object}
 */
const _DEFAULT_STYLE = {
  // テキストの改行を防止
  whiteSpace: "nowrap",

  // アニメーション効果の設定
  transition: "all 0.3s ease",

  // ホバー時のスタイル
  "&:hover": {
    // ボタンを少し上に浮かせる
    transform: "translateY(-1px)",
    // 影を付けて浮いているように見せる
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },

  // クリック時のスタイル
  "&:active": {
    // ボタンを元の位置に戻す
    transform: "translateY(0)",
  },

  // 無効化状態のスタイル
  "&.Mui-disabled": {
    // 透明度を下げて無効化状態を表現
    opacity: 0.7,
  },
};

/**
 * カスタムボタンコンポーネント
 * Material-UIのButtonコンポーネントを拡張したカスタムコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Node} props.children - ボタン内に表示する要素
 * @param {Object} props.sx - スタイルオブジェクト
 * @param {string} props.variant - ボタンの種類（text/contained/outlined）
 * @param {string} props.color - ボタンの色
 * @param {string} props.size - ボタンのサイズ
 * @param {boolean} props.disabled - 無効化状態
 * @param {Function} props.onClick - クリックイベントハンドラー
 * @param {boolean} props.is_debug - デバッグモードフラグ
 * @returns {JSX.Element} カスタマイズされたボタン
 *
 * @example
 * // 基本的な使用方法
 * <CustomButton onClick={handleClick}>
 *   クリックしてください
 * </CustomButton>
 *
 * // スタイルのカスタマイズ
 * <CustomButton
 *   variant="contained"
 *   color="primary"
 *   sx={{ borderRadius: '20px' }}
 * >
 *   カスタムボタン
 * </CustomButton>
 */
const CustomButton = (props) => {
  const { is_debug, ...restParams } = props;

  // デバッグモードが有効な場合、プロパティをログ出力
  if (is_debug != false) {
    log.debug("Button Props:", {
      is_debug,
      ...restParams,
    });
  }

  // デフォルトパラメータとプロパティのマージ
  const { children, variant, color, size, disabled, onClick, sx, fullWidth, fullwidth, ...rest } = {
    ...default_params.common,
    ...default_params.button,
    ...restParams,
  };

  // ボタンのプロパティを設定
  const _props = {
    ...rest,
    variant,
    color,
    size,
    disabled,
    onClick,
    fullWidth: fullWidth === true || fullwidth === true ? true : undefined,
    sx: {
      ..._DEFAULT_STYLE,
      ...sx,
    },
  };

  return <Button {..._props}>{children}</Button>;
  //},
  /**
   * パフォーマンス最適化のための比較関数
   * プロパティの変更がない場合は再レンダリングをスキップ
   *
   * @param {Object} prevProps - 前回のプロパティ
   * @param {Object} nextProps - 次のプロパティ
   * @returns {boolean} 再レンダリングが必要な場合はfalse
   */
  /*
  (prevProps, nextProps) => {
    return (
      prevProps.children === nextProps.children &&
      prevProps.variant === nextProps.variant &&
      prevProps.color === nextProps.color &&
      prevProps.size === nextProps.size &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.fullWidth === nextProps.fullWidth &&
      prevProps.fullwidth === nextProps.fullwidth &&
    JSON.stringify(prevProps.sx) === JSON.stringify(nextProps.sx)
  );
  */
};

// コンポーネント名を設定（デバッグ用）
CustomButton.displayName = "CustomButton";

// プロパティの型定義
CustomButton.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
  variant: PropTypes.oneOf(["text", "contained", "outlined"]),
  color: PropTypes.oneOf(["primary", "secondary", "error", "warning", "info", "success"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  fullwidth: PropTypes.bool,
};

// デフォルトプロパティの設定
CustomButton.defaultProps = {
  variant: "contained",
  color: "primary",
  size: "small",
  disabled: false,
};

export default CustomButton;
