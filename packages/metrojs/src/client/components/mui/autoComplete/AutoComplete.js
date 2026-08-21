/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom AutoComplete Component                     ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful autocomplete component built with   ║
 * ║   Material-UI, providing seamless user interaction            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file AutoComplete.js
 * @description カスタムオートコンプリートコンポーネント
 *
 * Material-UIのAutocompleteコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - スタイルの制御
 * - エラーハンドリング
 * - パフォーマンス最適化
 *
 * @example
 * // 基本的な使用方法
 * <CustomAutoComplete
 *   id="search"
 *   label="検索"
 *   options={['オプション1', 'オプション2', 'オプション3']}
 *   onChange={handleChange}
 * />
 *
 * // オブジェクト配列を使用する場合
 * <CustomAutoComplete
 *   id="users"
 *   label="ユーザー"
 *   options={[
 *     { value: 1, label: 'ユーザー1' },
 *     { value: 2, label: 'ユーザー2' }
 *   ]}
 *   onChange={handleUserChange}
 * />
 *
 * // エラー状態とヘルパーテキスト
 * <CustomAutoComplete
 *   id="email"
 *   label="メールアドレス"
 *   error={true}
 *   helperText="有効なメールアドレスを入力してください"
 * />
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { default_params } from "../default_params.js";
import logjs from "@krono-metro/metrojs/logjs";

const log = new logjs("AutoComplete");

/**
 * オートコンプリートのデフォルトスタイル定義
 * 基本レイアウト、ホバー効果、フォーカス状態などのスタイルを設定
 *
 * @type {Object}
 */
const _DEFAULT_STYLE = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "primary.main",
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
    },
  },
};

/**
 * デンスモード用のスタイル定義
 * コンパクトな表示に適したスタイルを設定
 *
 * @type {Object}
 */
const _DENSE_STYLE = {
  "& .MuiOutlinedInput-root": {
    padding: "4px 8px",
    "& .MuiOutlinedInput-input": {
      padding: "4px 8px",
      fontSize: "0.875rem",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    transform: "translate(14px, 8px) scale(1)",
    "&.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
    },
  },
  "& .MuiAutocomplete-popupIndicator": {
    padding: "4px",
  },
  "& .MuiAutocomplete-clearIndicator": {
    padding: "4px",
  },
};

/**
 * カスタムオートコンプリートコンポーネント
 * Material-UIのAutocompleteコンポーネントを拡張したカスタムコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.id - フィールドのID
 * @param {string} props.label - ラベルテキスト
 * @param {Array} props.options - 選択肢の配列
 * @param {Object} props.value - 現在の値
 * @param {Function} props.onChange - 値変更時のハンドラー
 * @param {Object} props.sx - スタイルオブジェクト
 * @param {boolean} props.disabled - 無効化状態
 * @param {boolean} props.is_debug - デバッグモード
 * @param {Function} props.after_func - 値変更後のコールバック関数
 * @param {boolean} props.dense - デンスモード
 * @param {string} props.color - テキストフィールドの色
 * @param {boolean} props.error - エラー状態
 * @param {string} props.helperText - ヘルプテキスト
 * @param {boolean} props.fullWidth - フルウィットモード
 * @returns {JSX.Element} カスタマイズされたオートコンプリート
 */
const CustomAutoComplete = (props) => {
  const { is_debug, ...restParams } = props;

  if (is_debug) {
    log.debug("AutoComplete Props:", props);
  }

  const {
    id,
    label,
    options = [],
    value,
    onChange,
    sx,
    disabled,
    after_func,
    helperText,
    color,
    error,
    fullWidth,
    variant,
    dense,
    onClose,
    ...rest
  } = {
    ...default_params.common,
    ...default_params.autoComplete,
    ...restParams,
  };

  const _log = (message) => {
    if (is_debug) {
      log.debug(`id:${id} ${message}`);
    }
  };
  const handleChange = (event, newValue) => {
    _log(`handleChange event:${event} newValue:${newValue}`);
    try {
      if (onChange) {
        onChange(event, newValue);
      }
    } catch (error) {
      log.error("AutoComplete handleChange error:", error);
    }
  };
  // フォーカスアウトしたときに呼ばれる。
  const funcOnClose = (event, val) => {
    _log(`funcOnClose value:${event.target.value} val:${val}`);
    try {
      if (typeof onClose == "function") {
        onClose(event, event.target.value);
      }
    } catch (error) {
      log.error("AutoComplete funcOnClose error:", error);
    }
  };

  const _props = {
    ...rest,
    id,
    options,
    value,
    disabled,
    onChange: handleChange,
    onInputChange: handleChange,
    onClose: funcOnClose,
    size: dense ? "small" : "medium",
    sx: {
      ..._DEFAULT_STYLE,
      ...(dense ? _DENSE_STYLE : {}),
      ...sx,
    },
    renderInput: (params) => {
      const textFieldProps = {
        ...params,
        label,
        variant: "outlined",
        fullWidth: fullWidth,
        color,
        error: error === true,
        helperText,
        size: dense ? "small" : "medium",
      };
      return <TextField {...textFieldProps} />;
    },
  };

  const autocompleteProps = {
    ..._props,
    fullWidth: fullWidth == true ? true : undefined,
  };

  return <Autocomplete {...autocompleteProps} />;
};

/**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
CustomAutoComplete.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ])
  ),
  value: PropTypes.any,
  onChange: PropTypes.func,
  sx: PropTypes.object,
  disabled: PropTypes.bool,
  is_debug: PropTypes.bool,
  after_func: PropTypes.func,
  dense: PropTypes.bool,
  color: PropTypes.oneOf(["primary", "secondary", "error", "info", "success", "warning"]),
  error: PropTypes.bool,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool,
};

/**
 * デフォルトプロパティの設定
 * コンポーネントのデフォルト値を設定
 *
 * @type {Object}
 */
CustomAutoComplete.defaultProps = {
  label: "",
  options: [],
};

export default CustomAutoComplete;
