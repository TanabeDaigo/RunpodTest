/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Input Component                            ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful input field component built with    ║
 * ║   Material-UI, providing seamless form handling experience    ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * カスタム入力フィールドコンポーネント
 *
 * Material-UIのTextFieldコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - スタイルの制御（改行なしの表示）
 * - propsの受け渡し
 *
 * @component
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Node} props.children - 入力フィールド内に表示する要素
 * @param {Object} props.sx - スタイルオブジェクト
 * @param {string} props.label - 入力フィールドのラベル
 * @param {string} props.placeholder - プレースホルダーテキスト
 * @param {string} props.type - 入力タイプ（text, number, email等）
 * @param {boolean} props.error - エラー状態
 * @param {boolean} props.disabled - 無効化状態
 * @param {Function} props.onChange - 変更イベントハンドラ
 * @param {boolean} props.isNumberOnly - 数字のみ許可
 * @param {boolean} props.isMailAddress - メールアドレス形式のみ許可
 * @returns {JSX.Element} カスタマイズされた入力フィールド
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import { default_params } from "../default_params.js";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

import utils from "@krono-metro/metrojs/utils";

import logjs from "@metrojs/logjs";

const log = new logjs("Input");

const _DEFAULT_STYLE = { whiteSpace: "nowrap" }; // 幅が狭いときに改行せずに表示

const inputStyles = {
  root: {
    width: "100%",
    // テキストが長い場合に省略記号（...）で表示
    "& .MuiInputBase-input": {
      textOverflow: "ellipsis !important",
    },
    // 必須フィールドのアスタリスク（*）を赤字で表示
    "& .MuiInputLabel-asterisk": {
      color: "error.main",
    },
    // 数値入力フィールドのスピンボタン（上下の矢印）を非表示にする
    // Firefox用の設定
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
    // Chrome、Safari用の設定
    "& input[type=number]::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    // disabled状態のスタイル
    "& .Mui-disabled": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      "& .MuiInputBase-input": {
        WebkitTextFillColor: "text.primary",
        color: "text.primary",
        padding: "0",
        opacity: 1,
      },
      "& .MuiInputLabel-root": {
        display: "none",
      },
    },
  },
  error: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "error.main",
      },
    },
  },
  // ...
};

const CustomInput = (props) => {
  const { is_debug, after_func: _after_func, is_standard = false, ...restParams } = props;

  if (is_debug != false) {
    log.debug(`Input id:${props.id} Props:`, {
      is_debug,
      ...restParams,
    });
  }

  const {
    label,
    placeholder,
    type,
    variant,
    helperText,
    error,
    disabled,
    color,
    sx,
    margin,
    autoComplete,
    multiline,
    size,
    maxRows,
    minRows,
    maxlength,
    textAlign,
    onChange,
    isNumberOnly,
    isMinus,
    isAlphabet,
    isNumAndAlpha,
    isMailAddress,
    isIpAddress,
    clear,
    fullWidth,
    fullwidth,
    id,
    dense,
    style,
    name,
    className,
    inputMode,
    ...rest
  } = {
    ...default_params.common,
    ...default_params.input,
    ...restParams,
  };

  // TextFieldに渡すpropsからカスタムプロパティを除外
  const {
    isNumberOnly: _isNumberOnly,
    isMinus: _isMinus,
    isAlphabet: _isAlphabet,
    isNumAndAlpha: _isNumAndAlpha,
    isMailAddress: _isMailAddress,
    isIpAddress: _isIpAddress,
    clear: _clear,
    is_debug: _is_debug,
    after_func: _after_func_rest,
    ...textFieldProps
  } = rest;

  const [value, setValue] = React.useState(restParams.value || "");
  const [showClearButton, setShowClearButton] = React.useState(false);
  const inputId = React.useId();

  const _log = (message) => {
    if (is_debug) {
      log.debug(`Input id:${id} ${message}`);
    }
  };

  _log(`Input id:${id} value:${value} restParams.value:${restParams.value}`);
  const resolvedPlaceholder = placeholder || label;

  const validateInput = (value) => {
    _log(`validateInput value:${value}`);
    const validationRules = {
      isNumberOnly: /[^0-9]/g,
      isMinus: /[^0-9-]/g,
      isAlphabet: /[^A-Za-z]/g,
      isNumAndAlpha: /[^A-Za-z0-9]/g,
      isMailAddress: /[^A-Za-z0-9@._-]/g,
      isIpAddress: /^(?!0)([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.(?!0)([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.(?!0)([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.(?!0)([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])$/,
    };
    let newValue = value;

    // IPアドレスの場合は、他のバリデーションをスキップ
    if (isIpAddress) {
      log.debug(`isIpAddress:${isIpAddress} value:${value}`);
      // IPアドレスの形式に一致しない文字を除去
      newValue = value.replace(/[^0-9.]/g, "");
      log.debug(`newValue:${newValue}`);
      return newValue;
    }

    // その他のバリデーション
    if (isNumberOnly) {
      newValue = value.replace(validationRules.isNumberOnly, "");
    }
    if (isMinus) {
      newValue = value.replace(validationRules.isMinus, "");
    }
    if (isAlphabet) {
      newValue = value.replace(validationRules.isAlphabet, "");
    }
    if (isNumAndAlpha) {
      newValue = value.replace(validationRules.isNumAndAlpha, "");
    }
    if (isMailAddress) {
      newValue = value.replace(validationRules.isMailAddress, "");
    }
    return newValue;
  };

  const handleChange = (e) => {
    let _value = e.target.value;

    if (_value?.length) {
      if ([isNumberOnly, isMinus, isAlphabet, isNumAndAlpha, isMailAddress, isIpAddress].some(Boolean)) {
        _value = validateInput(_value);
      }
    } else {
      _value = "";
    }

    setValue(_value);

    if (onChange) {
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: _value,
        },
      };
      onChange(newEvent, props);
    }
  };

  const handleMouseEnter = () => {
    _log(`handleMouseEnter id:${id} value:${value}`);
    if (clear && value) {
      setShowClearButton(true);
    }
  };

  const handleMouseLeave = () => {
    _log(`handleMouseLeave id:${id} value:${value}`);
    setShowClearButton(false);
  };

  const handleClear = (e) => {
    e.preventDefault();
    _log(`handleClear id:${id} value:${value}`);
    setValue("");
    if (onChange) {
      // クリアボタン用のイベントオブジェクトを作成
      const clearEvent = {
        target: {
          value: "",
          id: id,
          name: id,
        },
        type: "change",
        currentTarget: { value: "" },
      };
      onChange(clearEvent, props);
    }
    // onBlurイベントを発火させる
    if (props.onBlur) {
      const blurEvent = {
        target: {
          value: "",
          id: id,
          name: id,
        },
        type: "blur",
        currentTarget: { value: "" },
      };
      props.onBlur(blurEvent);
    }
  };

  const resolveInputType = () => {
    // 明示指定があれば最優先
    if (type) return type;

    if ( isNumberOnly || isMinus || isAlphabet || isNumAndAlpha || isMailAddress || isIpAddress) return "email";
    return "text";
  };

  const resolvedType = resolveInputType();

  if (is_standard === true) {
    // --- multiline の場合 ---
    if (multiline === true) {
      return (
        <textarea
          id={id}
          name={name}
          className={className}
          inputMode={inputMode}
          value={value}
          onChange={handleChange}
          onBlur={(e) => {
            if (props.onBlur) props.onBlur(e);
          }}
          maxLength={maxlength}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          autoComplete={autoComplete}
          rows={minRows || 10}
          style={{
            textAlign: textAlign,
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            padding: "6px 8px",
            fontSize: "inherit",
            resize: "vertical",
            width: "100%",
            transition: "all 0.3s ease",
            ...(disabled && {
              opacity: 0.5,
              cursor: "not-allowed",
            }),
            ...style,
          }}
          {...textFieldProps}
        />
      );
    }

    return (
      <input
        id={id}
        name={name}
        className={className}
        inputMode={inputMode}
        type={resolvedType}
        value={value}
        onChange={handleChange}
        onBlur={handleClear}
        maxLength={maxlength}
        placeholder={resolvedPlaceholder}
        disabled={disabled}
        autoComplete={autoComplete}
        style={{
          textAlign: textAlign,
          border: "1px solid #e5e7eb",
          borderRadius: "4px",
          padding: "4px 8px",
          fontSize: "inherit",
          transition: "all 0.3s ease",
          "&:focus": {
            outline: "none",
            borderColor: "#6366f1",
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
          },
          "&::placeholder": {
            color: "#9ca3af",
          },
          ...(disabled && {
            opacity: 0.5,
            cursor: "not-allowed",
          }),
          ...style,
        }}
        onBlur={(e) => {
          if (props.onBlur) {
            props.onBlur(e);
          }
        }}
        {...textFieldProps}
      />
    );
  }

  return (
    <TextField
      value={value}
      label={label}
      placeholder={resolvedPlaceholder}
      type={resolvedType}
      variant={variant}
      helperText={helperText}
      error={error}
      disabled={disabled}
      color={color}
      sx={{
        ...inputStyles.root,
        ...(error && inputStyles.error),
        ...sx,
      }}
      inputProps={{
        maxLength: maxlength,
        style: {
          textAlign: textAlign,
          ...style,
        },
        "aria-label": label || placeholder,
        "aria-invalid": error,
        "aria-describedby": helperText ? `${inputId}-helper-text` : undefined,
      }}
      margin={margin}
      fullWidth={fullWidth === true ? true : undefined}
      fullwidth={fullwidth === true ? true : undefined}
      dense={dense === true ? true : undefined}
      autoComplete={autoComplete}
      onChange={handleChange}
      multiline={multiline}
      size={size}
      maxRows={maxRows}
      minRows={minRows}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      InputProps={{
        endAdornment: clear && showClearButton && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} size="small" sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...textFieldProps}
    />
  );
};
CustomInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  sx: PropTypes.object,
  margin: PropTypes.string,
  autoComplete: PropTypes.string,
  multiline: PropTypes.bool,
  size: PropTypes.string,
  maxRows: PropTypes.number,
  minRows: PropTypes.number,
  maxlength: PropTypes.number,
  textAlign: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  isNumberOnly: PropTypes.bool,
  isMinus: PropTypes.bool,
  isAlphabet: PropTypes.bool,
  isNumAndAlpha: PropTypes.bool,
  isMailAddress: PropTypes.bool,
  isIpAddress: PropTypes.bool,
  clear: PropTypes.bool,
  fullWidth: PropTypes.bool,
  fullwidth: PropTypes.bool,
  id: PropTypes.string,
  dense: PropTypes.bool,
  is_debug: PropTypes.bool,
  after_func: PropTypes.func,
  is_standard: PropTypes.bool,
  children: PropTypes.node,
};

export default CustomInput;
