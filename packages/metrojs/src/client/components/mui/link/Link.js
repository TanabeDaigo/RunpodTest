/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Link Component                             ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful link component built with           ║
 * ║   Material-UI, providing seamless user interaction            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file Link.js
 * @description カスタムリンクコンポーネント
 *
 * Material-UIのLinkコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - スタイルの制御
 * - エラーハンドリング
 * - パフォーマンス最適化
 *
 * @example
 * // 基本的な使用方法
 * <Link href="/about">
 *   会社概要
 * </Link>
 *
 * // 外部リンク
 * <Link
 *   href="https://example.com"
 *   target="_blank"
 *   rel="noopener noreferrer"
 * >
 *   外部サイト
 * </Link>
 *
 * // カスタムスタイル
 * <Link
 *   href="/contact"
 *   color="primary"
 *   underline="hover"
 *   sx={{ fontWeight: 'bold' }}
 * >
 *   お問い合わせ
 * </Link>
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import { Link as MuiLink } from "@mui/material";
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";

const log = new logjs("Link");

const _DEFAULT_STYLE = {};

/**
 * リンクのデフォルトスタイル定義
 * 基本レイアウト、ホバー効果などのスタイルを設定
 *
 * @type {Object}
 */
const linkStyles = {
  root: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
};

/**
 * カスタムリンクコンポーネント
 * Material-UIのLinkコンポーネントを拡張したカスタムコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.name - リンクの名前
 * @param {string} props.id - リンクのID
 * @param {string} props.href - リンク先のURL
 * @param {Node} props.children - リンクの内容
 * @param {boolean} props.disabled - 無効化状態
 * @param {Function} props.onClick - クリックイベントハンドラー
 * @param {Object} props.sx - スタイルオブジェクト
 * @param {Object} props.style - インラインスタイル
 * @param {string} props.className - CSSクラス名
 * @param {string} props.title - ツールチップテキスト
 * @param {string} props.target - リンクの開き方
 * @param {string} props.rel - リンクの関係性
 * @param {string} props.size - リンクのサイズ
 * @param {string} props.color - リンクの色
 * @param {string} props.underline - アンダーラインの表示タイミング
 * @param {ElementType} props.component - カスタムコンポーネント
 * @param {boolean} props.is_debug - デバッグモード
 * @returns {JSX.Element} カスタマイズされたリンク
 */
const Link = (props) => {
  const {
    name,
    id,
    href,
    children,
    disabled,
    onClick,
    sx,
    style,
    className,
    title,
    target,
    rel,
    size,
    color,
    underline,
    component,
    is_debug,
    ...rest
  } = {
    ...default_params.common,
    ...default_params.link,
    ...props,
  };

  // デバッグモードの場合、propsの内容をログ出力
  if (is_debug) {
    log.debug("Link props:", {
      name,
      id,
      href,
      disabled,
      sx,
      style,
      className,
      title,
      target,
      rel,
      size,
      color,
      underline,
      component,
    });
  }

  // idが指定されていない場合はReact.useIdで生成
  const generatedId = React.useId();
  const linkId = id || `${name || "link"}-${generatedId}`;

  const handleClick = (e) => {
    try {
      if (disabled) {
        e.preventDefault();
        return;
      }

      if (onClick) {
        onClick(e);
      }
    } catch (error) {
      log.error("Link click error:", error);
    }
  };

  const linkProps = {
    ...default_params.common,
    ...default_params.link,
    ...props,
  };

  return (
    <MuiLink
      id={linkId}
      href={href}
      onClick={handleClick}
      disabled={disabled}
      sx={{
        ...linkStyles.root,
        ...sx,
      }}
      style={style}
      className={className}
      title={title}
      target={target}
      rel={rel}
      size={size}
      color={color}
      underline={underline}
      component={component}
      {...rest}
    >
      {children}
    </MuiLink>
  );
};

/**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
Link.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  sx: PropTypes.object,
  style: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.string,
  underline: PropTypes.oneOf(["none", "hover", "always"]),
  component: PropTypes.elementType,
  is_debug: PropTypes.bool,
};

export default Link;
