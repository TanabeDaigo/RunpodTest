/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom SelectMulti Component                      ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful multi-select component built with   ║
 * ║   Material-UI, providing seamless user interaction            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file SelectMulti.js
 * @description カスタム複数選択コンポーネント
 *
 * Material-UIのSelectコンポーネントをラップし、以下の機能を提供:
 * - 複数選択機能
 * - 全選択/全解除機能
 * - デフォルトパラメータの適用
 * - スタイルの制御
 * - エラーハンドリング
 * - パフォーマンス最適化
 *
 * @example
 * // 基本的な使用方法
 * <CustomSelectMulti
 *   label="カテゴリー"
 *   options={[
 *     { value: 'cat1', label: 'カテゴリー1' },
 *     { value: 'cat2', label: 'カテゴリー2' },
 *     { value: 'cat3', label: 'カテゴリー3' }
 *   ]}
 *   onChange={handleChange}
 * />
 *
 * // 全選択機能を無効化
 * <CustomSelectMulti
 *   label="タグ"
 *   selectAll={false}
 *   options={[
 *     { value: 'tag1', label: 'タグ1' },
 *     { value: 'tag2', label: 'タグ2' }
 *   ]}
 *   onChange={handleTagsChange}
 * />
 *
 * // エラー状態とヘルパーテキスト
 * <CustomSelectMulti
 *   label="権限"
 *   error={true}
 *   helperText="少なくとも1つの権限を選択してください"
 *   options={[
 *     { value: 'read', label: '読み取り' },
 *     { value: 'write', label: '書き込み' },
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
import { Select as MuiSelect, MenuItem, FormControl, InputLabel, FormHelperText, Checkbox, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";

const log = new logjs("SelectMulti");

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
  selectAllItem: {
    padding: "8px 16px",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  divider: {
    margin: "4px 0",
  },
};

/**
 * カスタム複数選択コンポーネント
 * Material-UIのSelectコンポーネントを拡張したカスタムコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.label - ラベルテキスト
 * @param {Array} props.options - 選択肢の配列
 * @param {Array} props.value - 現在の選択値
 * @param {Function} props.onChange - 値変更時のハンドラー
 * @param {boolean} props.selectAll - 全選択機能の有効/無効
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
 * @returns {JSX.Element} カスタマイズされた複数選択コンポーネント
 */
const CustomSelectMulti = (props) => {
  const { is_debug, after_func, value: externalValue, onChange: externalOnChange, selectAll: _selectAll = true, is_standard = false, ...restParams } = props;

  // 内部状態の管理（配列であることを保証）
  const [internalValue, setInternalValue] = React.useState(Array.isArray(externalValue) ? externalValue : []);
  // プルダウンの開閉状態を管理
  const [isOpen, setIsOpen] = React.useState(false);

  // 外部のvalueが変更された場合に内部状態を更新
  React.useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(Array.isArray(externalValue) ? externalValue : []);
    }
  }, [externalValue]);

  if (is_debug) {
    log.debug("SelectMulti Props:", {
      is_debug,
      externalValue,
      internalValue,
      ...restParams,
    });
  }

  const { label, options, disabled, error, helperText, sx, dense, fullwidth, variant, color, ...rest } = {
    ...default_params.common,
    ...default_params.select,
    ...restParams,
  };

  const _log = (message, arr = {}) => {
    if (is_debug) {
      log.debug(`${message}`, arr);
    }
  };

  const handleChange = (optionValue) => {
    try {
      let newValue = [...internalValue];

      const index = newValue.indexOf(optionValue);
      if (index === -1) {
        newValue.push(optionValue);
      } else {
        newValue.splice(index, 1);
      }

      newValue = newValue.filter((v) => v != null && v !== "").map((v) => v.toString().trim());

      setInternalValue(newValue);

      // 外部 onChange 呼び出し
      if (externalOnChange) {
        externalOnChange(
          {
            target: { value: newValue, name: props.name },
          },
          props
        );
      }
    } catch (error) {
      log.error("SelectMulti change error:", error);
    }
  };

  const handleSelectAll = (e) => {
    try {
      // イベントの伝播を停止
      e.stopPropagation();
      e.preventDefault();

      const isAllSelected = internalValue.length === options.length;
      const newValue = isAllSelected
        ? []
        : options
            .map((option) => option.value)
            .filter((value) => value !== undefined && value !== null && value !== "")
            .map((value) => value.trim()) // 余分な空白を削除
            .filter((value) => value !== ","); // カンマを除外
      _log(`handleSelectAll newValue:${newValue}`);

      // 内部状態を更新（配列であることを保証）
      setInternalValue(newValue);

      // 外部のonChangeが存在する場合は呼び出し
      if (externalOnChange) {
        const syntheticEvent = {
          target: {
            value: newValue,
            name: e.target.name || props.name,
          },
        };
        externalOnChange(syntheticEvent, props);
      }
    } catch (error) {
      log.error("SelectMulti select all error:", error);
    }
  };

  // dense属性の処理
  const isDense = dense === true || dense === "true";
  // fullwidth属性の処理
  const isFullWidth = fullwidth === true || fullwidth === "true";
  // 全選択状態の判定
  const isAllSelected = internalValue.length === options.length && options.length > 0;

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
      <MuiSelect
        value={internalValue}
        label={label}
        variant={variant}
        color={color}
        multiple={true}
        sx={isDense ? selectStyles.denseSelect : undefined}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        renderValue={(selected) => {
          if (!selected || selected.length === 0) return "";
          return selected
            .map((value) => options.find((opt) => opt.value === value)?.label)
            .filter(Boolean)
            .join(", ");
        }}
        {...rest}
      >
        {_selectAll && isOpen && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleSelectAll(e);
            }}
            dense={isDense}
            sx={isDense ? selectStyles.denseMenuItem : selectStyles.selectAllItem}
            disableRipple
          >
            <ListItemIcon>
              <Checkbox checked={isAllSelected} indeterminate={internalValue.length > 0 && !isAllSelected} />
            </ListItemIcon>
            <ListItemText primary={isAllSelected ? "全解除" : "全選択"} />
          </MenuItem>
        )}
        {_selectAll && isOpen && <Divider sx={selectStyles.divider} />}
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleChange(option.value);
            }}
            dense={isDense}
            sx={isDense ? selectStyles.denseMenuItem : undefined}
          >
            <ListItemIcon>
              <Checkbox checked={internalValue.includes(option.value)} />
            </ListItemIcon>
            <ListItemText primary={option.label} />
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
CustomSelectMulti.propTypes = {
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string),
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
  is_standard: PropTypes.bool,
};

/**
 * デフォルトプロパティの設定
 * コンポーネントのデフォルト値を設定
 *
 * @type {Object}
 */
CustomSelectMulti.defaultProps = {
  // ... existing code ...
};

export default CustomSelectMulti;
