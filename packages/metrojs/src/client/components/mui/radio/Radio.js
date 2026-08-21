/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Radio Component                            ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful radio button component built with   ║
 * ║   Material-UI, providing seamless user interaction            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file Radio.js
 * @description カスタムラジオボタンコンポーネント
 *
 * Material-UIのRadioコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - スタイルの制御
 * - エラーハンドリング
 * - パフォーマンス最適化
 *
 * @example
 * // 基本的な使用方法
 * <Radio
 *   label="性別"
 *   options={[
 *     { value: 'male', label: '男性' },
 *     { value: 'female', label: '女性' }
 *   ]}
 *   onChange={handleChange}
 * />
 *
 * // 行表示とデンスモード
 * <Radio
 *   label="年齢層"
 *   row={true}
 *   dense={true}
 *   options={[
 *     { value: '10s', label: '10代' },
 *     { value: '20s', label: '20代' },
 *     { value: '30s', label: '30代' }
 *   ]}
 * />
 *
 * // エラー状態
 * <Radio
 *   label="利用規約"
 *   error={true}
 *   options={[
 *     { value: 'agree', label: '同意する' },
 *     { value: 'disagree', label: '同意しない' }
 *   ]}
 * />
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import { Radio as MuiRadio, FormControlLabel, FormControl, FormLabel, RadioGroup } from "@mui/material";
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";

const log = new logjs("Radio");

/**
 * ラジオボタンのデフォルトスタイル定義
 * 基本レイアウト、グループ表示、ラベルなどのスタイルを設定
 *
 * @type {Object}
 */
const radioStyles = {
  root: {
    margin: "8px 0",
  },
  group: {
    display: "flex",
    flexDirection: "row",
  },
  groupColumn: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
  },
  dense: {
    margin: "4px 0",
    "& .MuiFormControlLabel-root": {
      marginRight: "8px",
    },
    "& .MuiFormLabel-root": {
      marginBottom: "4px",
    },
  },
};

/**
 * カスタムラジオボタンコンポーネント
 * Material-UIのRadioコンポーネントを拡張したカスタムコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.label - ラベルテキスト
 * @param {Array} props.options - 選択肢の配列
 * @param {string} props.value - 現在の選択値
 * @param {Function} props.onChange - 値変更時のハンドラー
 * @param {boolean} props.disabled - 無効化状態
 * @param {boolean} props.error - エラー状態
 * @param {Object} props.sx - スタイルオブジェクト
 * @param {boolean} props.dense - デンスモード
 * @param {boolean} props.row - 行表示モード
 * @param {string} props.id - フィールドのID
 * @param {string} props.name - フィールドの名前
 * @param {boolean} props.is_debug - デバッグモード
 * @param {Function} props.after_func - 値変更後のコールバック関数
 * @returns {JSX.Element} カスタマイズされたラジオボタングループ
 */
const Radio = (props) => {
  const { is_debug, is_standard = false, ...restParams } = props;

  const {
    label,
    options,
    disabled,
    onChange,
    error,
    sx,
    dense,
    after_func,
    id,
    name,
    row,
    value: initialValue,
    ...rest
  } = {
    ...default_params.common,
    ...default_params.radio,
    ...restParams,
  };

  const _log = (message) => {
    if (is_debug) {
      log.debug(`id:${id} ${message}`);
    }
  };
  if (is_debug) {
    log.debug("Radio Props:", {
      label,
      value: initialValue,
      options,
      disabled,
      error,
      sx,
      dense,
      after_func,
      id,
      name,
      row,
      ...rest,
    });
  }

  _log(`initialValue:${initialValue}`);

  const [value, setValue] = React.useState(initialValue || "");

  React.useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const handleChange = (e) => {
    try {
      const _value = e.target.value;
      _log(`selected value:${_value}`);
      setValue(_value);
      if (onChange) {
        onChange(e, props);
      }
    } catch (error) {
      log.error("Radio change error:", error);
    }
  };

  // dense属性を除外したradioPropsを作成
  const {
    dense: denseProp,
    row: rowProp,
    error: errorProp,
    ...radioProps
  } = {
    ...default_params.common,
    ...default_params.radio,
    ...rest,
    error,
  };
  _log(`value:${value}`);
  // dense属性の処理
  const isDense = dense === true || dense === "true";

  if (is_standard === true) {
    return (
      <>
        {options.map((opt) => (
          <label key={opt.value} style={{ marginRight: 8, cursor: "pointer" }}>
            <input type="radio" name={name || id} value={opt.value} checked={value === opt.value} onChange={handleChange} disabled={disabled} {...rest} />
            {opt.label}
          </label>
        ))}
      </>
    );
  }

  return (
    <FormControl
      component="fieldset"
      error={error}
      margin={isDense ? "dense" : "normal"}
      sx={{
        ...radioStyles.root,
        ...(isDense && radioStyles.dense),
        ...sx,
      }}
    >
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <RadioGroup name={name || id} value={value} onChange={handleChange} row={!!row} sx={row ? radioStyles.group : radioStyles.groupColumn}>
        {options.map((option) => (
          <FormControlLabel key={option.value} value={option.value} control={<MuiRadio {...radioProps} />} label={option.label} disabled={disabled} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

Radio.displayName = "Radio";

/**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
Radio.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  sx: PropTypes.object,
  is_debug: PropTypes.bool,
  dense: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  after_func: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  row: PropTypes.bool,
  is_standard: PropTypes.bool,
};

export default Radio;
