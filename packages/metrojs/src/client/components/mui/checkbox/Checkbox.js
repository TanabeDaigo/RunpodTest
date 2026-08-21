/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Checkbox Component                         ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful checkbox component built with       ║
 * ║   Material-UI, providing seamless form handling experience    ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file Checkbox.js
 * @description カスタムチェックボックスコンポーネント
 *
 * Material-UIのCheckboxコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - スタイルの制御
 * - エラーハンドリング
 * - パフォーマンス最適化
 * - 必須入力の表示
 * - ヘルパーテキストのサポート
 *
 * @example
 * // 基本的な使用方法
 * <Checkbox
 *   label="利用規約に同意する"
 *   checked={isChecked}
 *   onChange={handleChange}
 * />
 *
 * // エラー表示
 * <Checkbox
 *   label="プライバシーポリシーに同意する"
 *   checked={isChecked}
 *   error={true}
 *   helperText="同意が必要です"
 *   onChange={handleChange}
 * />
 *
 * // 必須入力
 * <Checkbox
 *   label="ニュースレターを受け取る"
 *   checked={isChecked}
 *   required={true}
 *   onChange={handleChange}
 * />
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";

const log = new logjs("Checkbox");

const _DEFAULT_STYLE = {};

/**
 * チェックボックスのデフォルトスタイル定義
 * 基本レイアウト、エラー表示などのスタイルを設定
 *
 * @type {Object}
 */
const checkboxStyles = {
  root: {
    "& .MuiCheckbox-root": {
      color: "primary.main",
    },
    "& .MuiCheckbox-root.MuiChecked": {
      color: "primary.main",
    },
  },
  error: {
    "& .MuiCheckbox-root": {
      color: "error.main",
    },
    "& .MuiCheckbox-root.MuiChecked": {
      color: "error.main",
    },
  },
};

/**
 * カスタムチェックボックスコンポーネント
 * Material-UIのCheckboxコンポーネントを拡張したカスタムコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.label - チェックボックスのラベル
 * @param {boolean} props.checked - チェック状態
 * @param {boolean} props.disabled - 無効化状態
 * @param {Function} props.onChange - 変更イベントハンドラ
 * @param {string} props.color - カラーバリエーション
 * @param {Object} props.sx - カスタムスタイル
 * @param {boolean} props.error - エラー状態
 * @param {boolean} props.fullwidth - 幅いっぱいに表示
 * @param {string} props.labelPlacement - ラベルの配置（start, end, top, bottom）
 * @param {string} props.helperText - ヘルパーテキスト
 * @param {boolean} props.required - 必須入力
 * @param {boolean} props.is_debug - デバッグモード
 * @returns {JSX.Element} カスタマイズされたチェックボックス
 */
const CustomCheckbox = (props) => {
  const { is_debug, is_standard = false, ...restParams } = props;
  const { label, checked, disabled, onChange, color, sx, error, fullwidth, labelPlacement, helperText, required, style, ...rest } = {
    ...default_params.common,
    ...default_params.checkbox,
    ...restParams,
  };

  const [isChecked, setIsChecked] = React.useState(checked || false);

  React.useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  if (is_debug) {
    log.debug("Checkbox Props:", {
      label,
      checked,
      disabled,
      color,
      sx,
      fullWidth: fullwidth,
      labelPlacement,
      helperText,
      required,
      style,
      ...rest,
    });
  }
  const _log = (message) => {
    if (is_debug) {
      log.debug(`id:${id} ${message}`);
    }
  };
  const handleChange = (e) => {
    try {
      const _checked = e.target.checked;
      _log(`handleChange checked:${_checked}`);
      setIsChecked(_checked);

      if (onChange) {
        onChange(e, props);
      }
    } catch (error) {
      log.error("Checkbox change error:", error);
    }
  };

  const checkboxProps = {
    ...default_params.common,
    ...default_params.checkbox,
    ...restParams,
  };
  if (is_standard === true) {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          color={color}
          style={{
            cursor: "pointer",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            transition: "all 0.3s ease",
            "&:focus": {
              outline: "none",
              borderColor: "#6366f1",
              boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
            },
            ...style,
          }}
          {...rest}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }

  return (
    <FormControl fullWidth={fullwidth} error={error}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            color={color}
            sx={{
              ...checkboxStyles.root,
              ...(error && checkboxStyles.error),
              ...(sx && {
                ...Object.entries(sx).reduce((acc, [key, value]) => {
                  if (key.includes("Mui-checked")) {
                    acc[key.replace("Mui-checked", "MuiChecked")] = value;
                  } else {
                    acc[key] = value;
                  }
                  return acc;
                }, {}),
              }),
              ...style,
            }}
            inputProps={{
              "aria-label": label,
              "aria-invalid": error,
              required,
            }}
            {...rest}
          />
        }
        label={
          <>
            {label}
            {required && <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>}
          </>
        }
        labelPlacement={labelPlacement}
      />
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

/**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
CustomCheckbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  color: PropTypes.string,
  sx: PropTypes.object,
  error: PropTypes.bool,
  is_debug: PropTypes.bool,
  fullwidth: PropTypes.bool,
  labelPlacement: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  is_standard: PropTypes.bool,
};

export default CustomCheckbox;
