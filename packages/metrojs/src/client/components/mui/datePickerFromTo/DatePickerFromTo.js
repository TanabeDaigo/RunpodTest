/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom DatePickerFromTo Component                 ║
 * ║   Copyright (c) 2025 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful date picker component built with    ║
 * ║   Material-UI, providing seamless date selection experience   ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file DatePickerFromTo.js
 * @description カスタム日付選択コンポーネント
 *
 * Material-UIのDatePickerFromToコンポーネントをラップし、以下の機能を提供:
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
import { DatePicker as MuiDatePickerFromTo } from "@mui/x-date-pickers/DatePicker";
import { default_params } from "../default_params.js";
import { styled } from '@mui/material/styles';
import { datetime } from '@metrojs/utils';
import { Paper, IconButton, Popper, Menu, MenuItem, ClickAwayListener,FormControlLabel, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import logjs from "@metrojs/logjs";
import dayjs from "dayjs";
import CustomDatePicker from "../datePicker/DatePicker.js"
import CustomSwitch from "../switch/Switch.js";

const log = new logjs("DatePickerFromTo");

const _DEFAULT_STYLE = {};


/**
 * 日付選択フィールドのデフォルトスタイル定義
 * 基本レイアウト、サイズバリエーション、エラー表示などのスタイルを設定
 *
 * @type {Object}
 */

const FieldFlexDiv = styled('div')({
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
})

const FieldFlexAlignStartDiv = styled('div')({
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'start',
})

/**
 * カスタム日付選択コンポーネント
 * Material-UIのDatePickerコンポーネントを拡張した、From-To形式のカスタムコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Object} props.paramsFrom - From側の日付Pickerのパラメータ
 * @param {Object} props.paramsTo - To側の日付Pickerのパラメータ
 * @param {Object} props.paramsOther - その他のパラメータ（Switchや共通スタイルなど）
 * @param {boolean} [props.paramsOther.showSwitch] - スイッチ表示の有無
 * @param {string} [props.paramsOther.switchLabel] - スイッチのラベル
 * @param {string} [props.paramsOther.switchSize] - スイッチのサイズ（small, medium）
 * @param {Object} [props.paramsOther.swichStyle] - スイッチのスタイル（sx）
 * @param {Object} [props.paramsOther.switchBoxStyle] - スイッチボックスの外枠スタイル
 * @param {boolean} [props.paramsOther.disabled] - 日付Pickerの無効化
 * @param {boolean} [props.paramsOther.isAnchorEl] - Popperを閉じる条件フラグ
 * @param {boolean} [props.is_debug] - デバッグモード（ログ出力ON）
 *
 * @returns {JSX.Element} カスタマイズされたFrom-To日付選択フィールド
 */
const CustomDatePickerFromTo = ({
    paramsFrom = {},
    paramsTo = {},
    paramsOther = {},
    is_debug = false
  }) => {

  const { ...restParamsFrom } = paramsFrom;
  const { ...restParamsTo } = paramsTo;
  const { ...restParamsOther } = paramsOther;

  if (is_debug) {
    log.debug("DatePickerFromTo Props:", {
      is_debug,
      ...restParamsFrom,
      ...restParamsTo,
      ...restParamsOther,
    });
  }

  const mergedFrom = {
    ...default_params.common,
    ...default_params.datePickerFrom,
    ...restParamsFrom,
  };

  const mergedTo = {
    ...default_params.common,
    ...default_params.datePickerTo,
    ...restParamsTo,
  };
  const {
    id,
    isAnchorEl,
    showSwitch,
    swichStyle,
    switchLabel,
    switchSize,
    switchBoxStyle,
    unspcified = {},
    ...rest
    } = {
      ...default_params.datePickerOther,
      ...restParamsOther,
    };

  const fromId = mergedFrom.id || "fromDate";
  const toId = mergedTo.id || "toDate";
  const defaultFromDate = (mergedFrom.value == null) ? datetime.getNow() : mergedFrom.value;
  const defaultToDate = (mergedTo.value == null) ? datetime.getNow() : mergedTo.value;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fromDate, setFromDate] = React.useState(paramsFrom.value);
  const [toDate, setToDate] = React.useState(paramsTo.value);
  const [unspcifiedChecked, setunspcifiedChecked] = React.useState(unspcified.default);

  React.useEffect(() => {
    setFromDate(paramsFrom.value ?? null);
  }, [paramsFrom.value]);

  React.useEffect(() => {
    setToDate(paramsTo.value ?? null);
  }, [paramsTo.value]);

  const _setDate = (_from, _to) => {
    setFromDate(_from);
    setToDate(_to)
    setAnchorEl(null);
    if (mergedFrom.onChange) {
      mergedFrom.onChange(_from, mergedFrom);
    }
    if (mergedTo.onChange) {
      mergedTo.onChange(_to, mergedTo);
    }
  };
  const _makeLink = (text) => {
    let _from, _to;
    if (text == '前日') {
      _from = dayjs(fromDate || defaultFromDate).subtract(1, 'day').format('YYYY/MM/DD');
      _to = dayjs(toDate || defaultToDate).subtract(1, 'day').format('YYYY/MM/DD');
    }
    if (text == '本日') {
      _from = dayjs().format('YYYY/MM/DD');
      _to = dayjs().format('YYYY/MM/DD');
    }
    if (text == '翌日') {
      _from = dayjs(fromDate || defaultFromDate).add(1, 'day').format('YYYY/MM/DD');
      _to = dayjs(toDate || defaultToDate).add(1, 'day').format('YYYY/MM/DD');
    }
    if (text == '前週') {
      _from = dayjs(fromDate || defaultFromDate).subtract(1, 'week').startOf('week').format('YYYY/MM/DD');
      _to = dayjs(fromDate || defaultFromDate).subtract(1, 'week').endOf('week').format('YYYY/MM/DD');
    }
    if (text == '今週') {
      _from = dayjs().startOf('week').format('YYYY/MM/DD');
      _to = dayjs().endOf('week').format('YYYY/MM/DD');
    }
    if (text == '次週') {
      _from = dayjs(fromDate || defaultFromDate).add(1, 'week').startOf('week').format('YYYY/MM/DD');
      _to = dayjs(fromDate || defaultFromDate).add(1, 'week').endOf('week').format('YYYY/MM/DD');
    }
    if (text == '前月') {
      _from = dayjs(fromDate || defaultFromDate).subtract(1, 'month').startOf('month').format('YYYY/MM/DD');
      _to = dayjs(fromDate || defaultFromDate).subtract(1, 'month').endOf('month').format('YYYY/MM/DD');
    }
    if (text == '今月') {
      _from = dayjs().startOf('month').format('YYYY/MM/DD');
      _to = dayjs().endOf('month').format('YYYY/MM/DD');
    }
    if (text == '次月') {
      _from = dayjs(fromDate || defaultFromDate).add(1, 'month').startOf('month').format('YYYY/MM/DD');
      _to = dayjs(fromDate || defaultFromDate).add(1, 'month').endOf('month').format('YYYY/MM/DD');
    }

    return (
      <span
        onClick={() => _setDate(_from, _to)}
        style={{
          color: '#1976d2',
          cursor: 'pointer',
          padding: '4px 8px',
          display: 'inline-block',
          minWidth: '50px',
          borderRadius: '4px',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(25, 118, 210, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {text}
      </span>
    );
  };

  const _makeHtml = () => {
    const _style = {
      row: { margin: '4px' },
      col: { padding: '8px 16px' },
    };
    return (
      <Paper style={{ padding: 8 }}>
        <FieldFlexAlignStartDiv>
          <div>
            <table style={{ margin: '8px 0px 8px 16px' }}>
              <tbody>
                <tr style={_style.row}>
                  <td style={_style.col}>{_makeLink('前日')}</td>
                  <td style={_style.col}>{_makeLink('本日')}</td>
                  <td style={_style.col}>{_makeLink('翌日')}</td>
                </tr>
                <tr style={_style.row}>
                  <td style={_style.col}>{_makeLink('前週')}</td>
                  <td style={_style.col}>{_makeLink('今週')}</td>
                  <td style={_style.col}>{_makeLink('次週')}</td>
                </tr>
                <tr style={_style.row}>
                  <td style={_style.col}>{_makeLink('前月')}</td>
                  <td style={_style.col}>{_makeLink('今月')}</td>
                  <td style={_style.col}>{_makeLink('次月')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => setAnchorEl(null)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </FieldFlexAlignStartDiv>
      </Paper>
    );
  };

  const handleToggle = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClickAway = () => {
    if(!isAnchorEl) {
      setAnchorEl(null);
    }
  };

  const handleunspcifiedCheckedChange = (event) => {
    const checked = event.target.checked;
    setunspcifiedChecked(checked);
    if (paramsOther.onChange) {
      paramsOther.onChange(checked);
    }
  };

  let isDisabled = false;

  if (unspcified.show) {
    isDisabled = !unspcifiedChecked;
  }
  if (mergedFrom.disabled || mergedTo.disabled) {
    isDisabled = true;
  }

  const detailedMenu = (
    <div>
      <IconButton size="small" onClick={handleToggle} aria-label="open menu" disabled={isDisabled}>
        <MoreVertIcon />
      </IconButton>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-end"
        style={{ zIndex: 1300 }}
        disablePortal
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>{_makeHtml()}</div>
        </ClickAwayListener>
      </Popper>
    </div>
  );

  const _style = {
    contents: {
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'start',
    },
  };

  return (
      <FieldFlexDiv style={_style.contents}>
        {unspcified.show && (
          <div style={{ marginRight: '-12px', paddingTop: '12px', ...switchBoxStyle }}>
            <CustomSwitch
              checked={unspcifiedChecked}
              onChange={(e) => {
                const checked = e.target.checked;
                setunspcifiedChecked(checked);

                if (paramsOther.onChange) {
                  paramsOther.onChange(checked);
                }
              }}
              label={switchLabel}
              size={switchSize}
              sx={swichStyle}
            />
          </div>
        )}

        <CustomDatePicker
          {...mergedFrom}
          id={fromId}
          value={fromDate}
          disabled={isDisabled}
          maxDate={toDate ? dayjs(toDate).toDate() : undefined}
          onChange={(newVal) => {
            setFromDate(newVal);
            if (mergedFrom.onChange) {
              mergedFrom.onChange(newVal, mergedFrom);
            }
          }}
        />

        <div style={{ width: '8px' }} />

        <CustomDatePicker
          {...mergedTo}
          id={toId}
          value={toDate}
          disabled={isDisabled}
          minDate={fromDate ? dayjs(fromDate).toDate() : undefined}
          onChange={(newVal) => {
            setToDate(newVal);
            if (mergedTo.onChange) {
              mergedTo.onChange(newVal, mergedTo);
            }
          }}
        />

        <div style={{ marginTop: '20px' }}>{detailedMenu}</div>
      </FieldFlexDiv>
  );
};

/**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
CustomDatePickerFromTo.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  format: PropTypes.string,
  sx: PropTypes.object,
  error: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "error",
    "info",
    "success",
    "warning",
  ]),
  readOnly: PropTypes.bool,
  helperText: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(["standard", "outlined", "filled"]),
  dense: PropTypes.bool,
  outputFormat: PropTypes.oneOf(["YYYY/MM/DD", "YYYY-MM-DD", "YYYYMMDD"]),
  is_debug: PropTypes.bool,
  isAnchorEl: PropTypes.bool,

  showSwitch: PropTypes.bool,
  switchLabel: PropTypes.string,
  switchSize: PropTypes.oneOf(["small", "medium"]),
  swichStyle: PropTypes.object,
  switchBoxStyle: PropTypes.object,
};

export default CustomDatePickerFromTo;
