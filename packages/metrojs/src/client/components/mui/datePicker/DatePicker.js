/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom DatePicker Component                       ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful date picker component built with    ║
 * ║   Material-UI, providing seamless date selection experience   ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file DatePicker.js
 * @description カスタム日付選択コンポーネント
 *
 * Material-UIのDatePickerコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - スタイルの制御
 * - エラーハンドリング
 * - パフォーマンス最適化
 * - 様々な日付フォーマットのサポート
 *
 * @example
 * // 基本的な使用方法
 * <DatePicker
 *   label="生年月日"
 *   value={selectedDate}
 *   onChange={handleDateChange}
 * />
 *
 * // カスタムフォーマット
 * <DatePicker
 *   label="予定日"
 *   value={selectedDate}
 *   format="yyyy/MM/dd"
 *   outputFormat="YYYYMMDD"
 *   onChange={handleDateChange}
 * />
 *
 * // エラー表示
 * <DatePicker
 *   label="期限日"
 *   value={selectedDate}
 *   error={true}
 *   helperText="期限日を選択してください"
 *   onChange={handleDateChange}
 * />
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ja from "date-fns/locale/ja";
import { default_params } from "../default_params.js";

import logjs from "@metrojs/logjs";

const log = new logjs("DatePicker");

const _DEFAULT_STYLE = {};

/**
 * Date / dayjs / moment / 対応文字列を HTML5 input[type=date] 用 YYYY-MM-DD に変換（ローカル日付）
 * @param {unknown} dateLike
 * @returns {string|undefined}
 */
function toLocalYyyyMmDd(dateLike) {
  if (dateLike == null || dateLike === "") return undefined;

  if (typeof dateLike === "string") {
    const m = dateLike.toString().match(/^(\d{4})[/-](\d{2})[/-](\d{2})/);
    if (m) {
      return `${m[1]}-${m[2]}-${m[3]}`;
    }
    const compact = dateLike.toString().match(/^(\d{4})(\d{2})(\d{2})$/);
    if (compact) {
      return `${compact[1]}-${compact[2]}-${compact[3]}`;
    }
    return undefined;
  }

  if (dateLike instanceof Date && !isNaN(dateLike.getTime())) {
    const y = dateLike.getFullYear();
    const mo = String(dateLike.getMonth() + 1).padStart(2, "0");
    const d = String(dateLike.getDate()).padStart(2, "0");
    return `${y}-${mo}-${d}`;
  }

  if (typeof dateLike?.toDate === "function") {
    return toLocalYyyyMmDd(dateLike.toDate());
  }
  if (typeof dateLike?.format === "function") {
    const s = dateLike.format("YYYY-MM-DD");
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : undefined;
  }

  return undefined;
}

/** @returns {string} 今日のローカル日付 YYYY-MM-DD */
function localTodayYyyyMmDd() {
  const n = new Date();
  const y = n.getFullYear();
  const mo = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

/** YYYY-MM-DD 同士でより遅い（下限として厳しい）日付 */
function laterYyyyMmDd(a, b) {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

/** YYYY-MM-DD 同士でより早い（上限として厳しい）日付 */
function earlierYyyyMmDd(a, b) {
  if (!a) return b;
  if (!b) return a;
  return a < b ? a : b;
}

/**
 * 日付選択フィールドのデフォルトスタイル定義
 * 基本レイアウト、サイズバリエーション、エラー表示などのスタイルを設定
 *
 * @type {Object}
 */
const datePickerStyles = {
  // 基本スタイル
  root: {
    width: "100%", // 幅を100%に設定
    "& .MuiInputBase-root": {
      height: "56px", // 標準の高さ
    },
    "& .MuiInputBase-input": {
      textAlign: "center", // テキストを中央揃え
    },
    // 必須項目のアスタリスクを赤くする
    "& .MuiFormLabel-asterisk": {
      color: "error.main",
    },
  },
  // 小さいサイズ用のスタイル
  small: {
    "& .MuiInputBase-root": {
      height: "40px", // 小さいサイズの高さ
    },
  },
  // コンパクト表示用のスタイル
  dense: {
    width: "auto", // 幅を自動調整
    minWidth: "120px", // 最小幅を設定
    "& .MuiInputBase-root": {
      height: "32px", // コンパクトな高さ
      padding: "4px 8px", // パディングを調整
    },
    "& .MuiInputBase-input": {
      width: "100px", // 入力フィールドの幅を固定
      padding: "0 32px 0 8px", // パディングを調整
      textAlign: "left", // テキストを中央揃え
    },
    "& .MuiInputLabel-root": {
      marginLeft: "8px",
      transform: "translate(0px, 20px) scale(0.85)", // ラベルの初期位置
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)", // ラベルの縮小時の位置
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      top: 0, // アウトラインの位置を調整
    },
    "& .MuiInputAdornment-root": {
      marginTop: "0 !important", // アイコンのマージンを調整
    },
  },
  // エラー表示用のスタイル
  error: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "error.main", // エラー時のボーダーカラー
      },
    },
  },
};

/**
 * カスタム日付選択コンポーネント
 * Material-UIのDatePickerコンポーネントを拡張したカスタムコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.label - 日付選択フィールドのラベル
 * @param {Date|string} props.value - 選択された日付
 * @param {boolean} props.disabled - 無効化状態
 * @param {Function} props.onChange - 変更イベントハンドラ
 * @param {string} props.format - 日付フォーマット
 * @param {Object} props.sx - カスタムスタイル
 * @param {string} props.outputFormat - 出力形式（YYYY/MM/DD, YYYY-MM-DD, YYYYMMDD）
 * @param {boolean} props.error - エラー状態
 * @param {string} props.helperText - ヘルパーテキスト
 * @param {string} props.size - サイズ（small, medium, large）
 * @param {string} props.color - カラー
 * @param {boolean} props.readOnly - 読み取り専用
 * @param {Date|string} props.defaultValue - デフォルト値
 * @param {boolean} props.fullWidth - 幅いっぱいに表示
 * @param {string} props.variant - バリアント（outlined, filled, standard）
 * @param {boolean} props.dense - コンパクト表示
 * @param {boolean} props.is_debug - デバッグモード
 * @param {boolean} props.required - 必須フィールド
 * @returns {JSX.Element} カスタマイズされた日付選択フィールド
 */
const CustomDatePicker = (props) => {
  const { is_debug, is_standard = false, ...restParams } = props;

  if (is_debug) {
    log.debug("DatePicker Props:", {
      is_debug,
      ...restParams,
    });
  }

  const { label, value, disabled, onChange, format, sx, error, size, color, readOnly, helperText, defaultValue, fullWidth, variant, dense, outputFormat, required, style, ...rest } = {
    ...default_params.common,
    ...default_params.datePicker,
    ...restParams,
  };

  /**
   * 文字列形式の日付をDateオブジェクトに変換
   * @param {Date|string} dateValue - 変換する日付
   * @returns {Date|null} 変換されたDateオブジェクト
   */
  const parseDate = (dateValue) => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;

    // 様々な形式の日付文字列に対応
    const formats = [
      /^(\d{4})\/(\d{2})\/(\d{2})$/, // YYYY/MM/DD
      /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
      /^(\d{4})(\d{2})(\d{2})$/, // YYYYMMDD
    ];

    for (const regex of formats) {
      const match = dateValue.toString().match(regex);
      if (match) {
        const [, year, month, day] = match;
        return new Date(year, month - 1, day);
      }
    }

    return null;
  };

  /**
   * Dateオブジェクトを文字列形式に変換
   * @param {Date} date - 変換するDateオブジェクト
   * @returns {string|Date} 変換された文字列または元のDateオブジェクト
   */
  const formatDate = (date) => {
    _log(`formatDate date:${date}`);
    if (!date) return null;
    _log(`formatDate date instanceof Date:${date instanceof Date}`);
    if (!(date instanceof Date)) return date;
    _log(`formatDate date.getFullYear():${date.getFullYear()}`);
    _log(`formatDate date.getMonth():${date.getMonth()}`);
    _log(`formatDate date.getDate():${date.getDate()}`);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    switch (outputFormat) {
      case "YYYY/MM/DD":
        return `${year}/${month}/${day}`;
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "YYYYMMDD":
        return `${year}${month}${day}`;
      default:
        return date;
    }
  };
  const _log = (message) => {
    if (is_debug) {
      log.debug(`id:${id} ${message}`);
    }
  };
  /**
   * 日付変更時のハンドラ
   * @param {Date} newValue - 新しい日付
   */
  const handleChange = (newValue) => {
    try {
      _log(`handleChange selected date:${newValue}`);

      if (onChange) {
        // null や undefined の場合
        if (!newValue) {
          onChange(null, props);
          return;
        }

        // Invalid Date の場合
        if (Object.prototype.toString.call(newValue) === "[object Date]" && isNaN(newValue.getTime())) {
          onChange(null, props);
          return;
        }

        // 有効な Date の場合のみフォーマット
        const formattedValue =
          outputFormat && Object.prototype.toString.call(newValue) === "[object Date]"
            ? formatDate(newValue)
            : newValue;

        _log(`handleChange formattedValue:${formattedValue}`);
        onChange(formattedValue, props);
      }
    } catch (error) {
      log.error("DatePicker change error:", error);
    }
  };

  const _props = {
    ...rest,
    fullWidth,
  };

  if (is_standard === true) {
    const handleStandardChange = (e) => {
      const inputValue = e.target.value;
      if (onChange) {
        onChange(inputValue, props);
      }
    };

    const { disableFuture, disablePast, minDate, maxDate, ...inputProps } = rest;

    const todayStr = localTodayYyyyMmDd();
    const minDateStr = toLocalYyyyMmDd(minDate);
    const maxDateStr = toLocalYyyyMmDd(maxDate);

    let minAttr;
    if (disablePast && minDateStr) {
      minAttr = laterYyyyMmDd(todayStr, minDateStr);
    } else if (disablePast) {
      minAttr = todayStr;
    } else if (minDateStr) {
      minAttr = minDateStr;
    }

    let maxAttr;
    if (disableFuture && maxDateStr) {
      maxAttr = earlierYyyyMmDd(todayStr, maxDateStr);
    } else if (disableFuture) {
      maxAttr = todayStr;
    } else if (maxDateStr) {
      maxAttr = maxDateStr;
    }

    if (minAttr && maxAttr && minAttr > maxAttr) {
      maxAttr = minAttr;
    }

    let inputValue = "";
    if (value != null && value !== "") {
      if (value instanceof Date) {
        inputValue = toLocalYyyyMmDd(value) || "";
      } else if (typeof value === "string") {
        inputValue = toLocalYyyyMmDd(value) || value;
      } else {
        inputValue = toLocalYyyyMmDd(value) || "";
      }
    }

    return (
      <input
        type="date"
        value={inputValue}
        min={minAttr}
        max={maxAttr}
        onChange={handleStandardChange}
        disabled={disabled}
        readOnly={readOnly}
        style={{
          fontSize: "inherit",
          padding: "4px 8px",
          border: "1px solid #e5e7eb",
          borderRadius: "4px",
          transition: "all 0.3s ease",
          "&:focus": {
            outline: "none",
            borderColor: "#6366f1",
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
          },
        }}
        {...inputProps}
      />
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <MuiDatePicker
        label={label}
        value={parseDate(value) || null}
        defaultValue={parseDate(defaultValue)}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        format={format}
        sx={{
          ...datePickerStyles.root,
          ...(size === "small" && datePickerStyles.small),
          ...(dense && datePickerStyles.dense),
          ...(error && datePickerStyles.error),
          ...sx,
        }}
        slotProps={{
          textField: {
            error: error,
            fullWidth: fullWidth,
            size: size,
            color: color,
            variant: variant,
            helperText: helperText,
            margin: dense ? "dense" : "normal",
            required: required,
            inputProps: {
              "aria-label": label,
              "aria-invalid": error,
              readOnly: readOnly,
              required: required,
              ...style,
            },
          },
        }}
        {..._props}
      />
    </LocalizationProvider>
  );
};

/**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
CustomDatePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  format: PropTypes.string,
  sx: PropTypes.object,
  error: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium"]),
  color: PropTypes.oneOf(["primary", "secondary", "error", "info", "success", "warning"]),
  readOnly: PropTypes.bool,
  helperText: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(["standard", "outlined", "filled"]),
  dense: PropTypes.bool,
  outputFormat: PropTypes.oneOf(["YYYY/MM/DD", "YYYY-MM-DD", "YYYYMMDD"]),
  required: PropTypes.bool,
  is_standard: PropTypes.bool,
};

export default CustomDatePicker;
