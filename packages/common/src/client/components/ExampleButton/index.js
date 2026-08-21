/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Example Button Component                         ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   基本的なボタンコンポーネント                                ║
 * ║   主な機能：様々なスタイル、サイズ、状態のボタン              ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * ボタンのバリアント定数
 */
const BUTTON_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
  INFO: "info",
  LIGHT: "light",
  DARK: "dark",
  OUTLINE: "outline",
  GHOST: "ghost",
};

/**
 * ボタンのサイズ定数
 */
const BUTTON_SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  XLARGE: "xlarge",
};

/**
 * ボタンの形状定数
 */
const BUTTON_SHAPES = {
  ROUNDED: "rounded",
  PILL: "pill",
  SQUARE: "square",
};

/**
 * ExampleButtonコンポーネント
 *
 * @param {Object} props - プロパティ
 * @param {string} props.variant - ボタンのバリアント
 * @param {string} props.size - ボタンのサイズ
 * @param {string} props.shape - ボタンの形状
 * @param {boolean} props.disabled - 無効化フラグ
 * @param {boolean} props.loading - ローディング状態
 * @param {boolean} props.fullWidth - 全幅表示フラグ
 * @param {string} props.className - 追加のCSSクラス
 * @param {Function} props.onClick - クリックイベントハンドラー
 * @param {React.ReactNode} props.children - 子要素
 * @param {string} props.type - ボタンのタイプ（button, submit, reset）
 * @param {string} props.icon - アイコン（オプション）
 * @param {string} props.iconPosition - アイコンの位置（left, right）
 * @returns {JSX.Element} ボタンコンポーネント
 */
const ExampleButton = ({
  variant = BUTTON_VARIANTS.PRIMARY,
  size = BUTTON_SIZES.MEDIUM,
  shape = BUTTON_SHAPES.ROUNDED,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  onClick,
  children,
  type = "button",
  icon,
  iconPosition = "left",
  ...props
}) => {
  // ベースクラス
  const baseClasses = "example-button";

  // バリアントクラス
  const variantClasses = {
    [BUTTON_VARIANTS.PRIMARY]: "example-button--primary",
    [BUTTON_VARIANTS.SECONDARY]: "example-button--secondary",
    [BUTTON_VARIANTS.SUCCESS]: "example-button--success",
    [BUTTON_VARIANTS.DANGER]: "example-button--danger",
    [BUTTON_VARIANTS.WARNING]: "example-button--warning",
    [BUTTON_VARIANTS.INFO]: "example-button--info",
    [BUTTON_VARIANTS.LIGHT]: "example-button--light",
    [BUTTON_VARIANTS.DARK]: "example-button--dark",
    [BUTTON_VARIANTS.OUTLINE]: "example-button--outline",
    [BUTTON_VARIANTS.GHOST]: "example-button--ghost",
  };

  // サイズクラス
  const sizeClasses = {
    [BUTTON_SIZES.SMALL]: "example-button--small",
    [BUTTON_SIZES.MEDIUM]: "example-button--medium",
    [BUTTON_SIZES.LARGE]: "example-button--large",
    [BUTTON_SIZES.XLARGE]: "example-button--xlarge",
  };

  // 形状クラス
  const shapeClasses = {
    [BUTTON_SHAPES.ROUNDED]: "example-button--rounded",
    [BUTTON_SHAPES.PILL]: "example-button--pill",
    [BUTTON_SHAPES.SQUARE]: "example-button--square",
  };

  // 状態クラス
  const stateClasses = {
    disabled: disabled ? "example-button--disabled" : "",
    loading: loading ? "example-button--loading" : "",
    fullWidth: fullWidth ? "example-button--full-width" : "",
  };

  // クラス名を結合
  const buttonClasses = [baseClasses, variantClasses[variant], sizeClasses[size], shapeClasses[shape], stateClasses.disabled, stateClasses.loading, stateClasses.fullWidth, className]
    .filter(Boolean)
    .join(" ");

  // クリックハンドラー
  const handleClick = (event) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  // アイコンをレンダリング
  const renderIcon = () => {
    if (!icon) return null;

    const iconClasses = ["example-button__icon", `example-button__icon--${iconPosition}`].join(" ");

    return <span className={iconClasses}>{icon}</span>;
  };

  // ローディングスピナーをレンダリング
  const renderLoader = () => {
    if (!loading) return null;

    return (
      <span className="example-button__loader">
        <span className="example-button__loader-spinner"></span>
      </span>
    );
  };

  return (
    <button type={type} className={buttonClasses} disabled={disabled || loading} onClick={handleClick} {...props}>
      {renderLoader()}

      {icon && iconPosition === "left" && renderIcon()}

      <span className="example-button__content">{children}</span>

      {icon && iconPosition === "right" && renderIcon()}
    </button>
  );
};

// PropTypes定義
ExampleButton.propTypes = {
  variant: PropTypes.oneOf(Object.values(BUTTON_VARIANTS)),
  size: PropTypes.oneOf(Object.values(BUTTON_SIZES)),
  shape: PropTypes.oneOf(Object.values(BUTTON_SHAPES)),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
};

// デフォルトプロパティ
ExampleButton.defaultProps = {
  variant: BUTTON_VARIANTS.PRIMARY,
  size: BUTTON_SIZES.MEDIUM,
  shape: BUTTON_SHAPES.ROUNDED,
  disabled: false,
  loading: false,
  fullWidth: false,
  className: "",
  type: "button",
  iconPosition: "left",
};

// 定数をエクスポート
ExampleButton.VARIANTS = BUTTON_VARIANTS;
ExampleButton.SIZES = BUTTON_SIZES;
ExampleButton.SHAPES = BUTTON_SHAPES;

export default ExampleButton;
