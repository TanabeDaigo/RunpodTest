/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Select Component                           ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful select component built with         ║
 * ║   Material-UI, providing seamless user interaction            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file Select.js
 * @description カスタムセレクトボックスコンポーネント
 *
 * Material-UIのSelectコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - スタイルの制御
 * - エラーハンドリング
 * - パフォーマンス最適化
 *
 * @example
 * // 基本的な使用方法
 * <CustomSelect
 *   label="カテゴリー"
 *   options={[
 *     { value: 'cat1', label: 'カテゴリー1' },
 *     { value: 'cat2', label: 'カテゴリー2' },
 *     { value: 'cat3', label: 'カテゴリー3' }
 *   ]}
 *   onChange={handleChange}
 * />
 *
 * // デンスモードとフルウィット
 * <CustomSelect
 *   label="都道府県"
 *   dense={true}
 *   fullwidth={true}
 *   options={[
 *     { value: 'tokyo', label: '東京都' },
 *     { value: 'osaka', label: '大阪府' }
 *   ]}
 * />
 *
 * // エラー状態とヘルパーテキスト
 * <CustomSelect
 *   label="権限"
 *   error={true}
 *   helperText="権限を選択してください"
 *   options={[
 *     { value: 'user', label: '一般ユーザー' },
 *     { value: 'admin', label: '管理者' }
 *   ]}
 * />
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import { Select as MuiSelect, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";

const log = new logjs("Select");

/**
 * セレクトボックスのスタイル定義
 * 基本レイアウト、デンスモード、ラベル、メニュー項目などのスタイルを設定
 *
 * @type {Object}
 */
const selectStyles = {
  root: {
    margin: "8px 0",
    minWidth: 120,
  },
  denseRoot: {
    margin: "4px 0",
    minWidth: 120,
  },
  label: {
    marginBottom: "8px",
  },
  denseLabel: {
    marginBottom: "4px",
    fontSize: "0.875rem",
  },
  denseSelect: {
    fontSize: "0.875rem",
    padding: "4px 8px",
  },
  denseMenuItem: {
    fontSize: "0.875rem",
    padding: "4px 8px",
  },
};

/**
 * カスタムセレクトボックスコンポーネント
 * Material-UIのSelectコンポーネントを拡張したカスタムコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.label - ラベルテキスト
 * @param {Array} props.options - 選択肢の配列
 * @param {string|Array} props.value - 現在の選択値
 * @param {Function} props.onChange - 値変更時のハンドラー
 * @param {boolean} props.disabled - 無効化状態
 * @param {boolean} props.error - エラー状態
 * @param {string} props.helperText - ヘルプテキスト
 * @param {Object} props.sx - スタイルオブジェクト
 * @param {boolean} props.dense - デンスモード
 * @param {boolean} props.fullwidth - フルウィットモード
 * @param {string} props.variant - フィールドのスタイル
 * @param {string} props.color - テキストフィールドの色
 * @param {boolean} props.is_debug - デバッグモード
 * @param {Function} props.after_func - 値変更後のコールバック関数
 * @returns {JSX.Element} カスタマイズされたセレクトボックス
 */
const CustomSelect = (props) => {
  const { is_debug, after_func, is_standard = false, value: externalValue, onChange: externalOnChange, ...restParams } = props;

  // 内部状態の管理
  const [internalValue, setInternalValue] = React.useState(externalValue || "");

  // 外部のvalueが変更された場合に内部状態を更新
  React.useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  if (is_debug) {
    log.debug("Select Props:", {
      is_debug,
      externalValue,
      internalValue,
      ...restParams,
    });
  }

  const { label, options, disabled, error, helperText, sx, dense, fullwidth, variant, color, id, ...rest } = {
    ...default_params.common,
    ...default_params.select,
    ...restParams,
  };

  const _log = (message) => {
    if (is_debug) {
      log.debug(`Input id:${id} ${message}`);
    }
  };

  const handleChange = (e) => {
    try {
      const newValue = e.target.value;
      _log(`selected value:${newValue}`);

      // 内部状態を更新
      setInternalValue(newValue);

      // 外部のonChangeが存在する場合は呼び出し
      if (externalOnChange) {
        externalOnChange(e, props);
      }
    } catch (error) {
      log.error("Select change error:", error);
    }
  };

  // dense属性の処理
  const isDense = dense === true || dense === "true";
  // fullwidth属性の処理
  const isFullWidth = fullwidth === true || fullwidth === "true";

  if (is_standard === true) {
    return (
      <select value={internalValue} onChange={handleChange} disabled={disabled} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <FormControl
      error={error}
      disabled={disabled}
      margin={isDense ? "dense" : "normal"}
      fullWidth={isFullWidth}
      variant={variant}
      color={color}
      sx={{
        ...(isDense ? selectStyles.denseRoot : selectStyles.root),
        ...sx,
      }}
    >
      {label && <InputLabel sx={isDense ? selectStyles.denseLabel : selectStyles.label}>{label}</InputLabel>}
      <MuiSelect value={internalValue} onChange={handleChange} label={label} variant={variant} color={color} sx={isDense ? selectStyles.denseSelect : undefined} {...rest}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={isDense ? selectStyles.denseMenuItem : undefined}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

/**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
CustomSelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  sx: PropTypes.object,
  dense: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  fullwidth: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  after_func: PropTypes.func,
  variant: PropTypes.oneOf(["standard", "outlined", "filled"]),
  color: PropTypes.oneOf(["primary", "secondary", "error", "info", "success", "warning"]),
};

export default CustomSelect;
