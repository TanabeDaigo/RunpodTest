/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Switch Component                           ║
 * ║   Copyright (c) 2025 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful switch component built with         ║
 * ║   Material-UI, providing seamless user interaction            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file Switch.js
 * @description カスタムスイッチコンポーネント
 *
 * Material-UIのSwitchコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - propsの受け渡し
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";

import React from "react";
import PropTypes from "prop-types";
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { default_params } from "../default_params.js";
import utils from "@metrojs/utils";
import logjs from "@metrojs/logjs";

const log = new logjs("Switch");
/**
 * カスタムスイッチコンポーネント  
 * Material-UI の Switch をベースにしたカスタムトグル UI
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.id - スイッチ要素の一意なID
 * @param {string} props.name - フォームで使用されるスイッチの名前
 * @param {boolean} props.checked - チェック状態（制御コンポーネントとして使用する場合）
 * @param {boolean} props.defaultChecked - 初期チェック状態（非制御コンポーネント用）
 * @param {'small'|'medium'} props.size - スイッチサイズ
 * @param {'primary'|'secondary'|'default'|'error'|'info'|'success'|'warning'} props.color - スイッチの色
 * @param {Function} props.onChange - チェック状態変更時のコールバック `(event)`
 * @param {boolean} props.disabled - スイッチの無効化フラグ
 * @param {boolean} props.disableRipple - リップル効果の無効化（UIの静音化用）
 * @param {React.ReactNode} props.label - スイッチ横に表示するラベル
 * @param {'end'|'start'|'top'|'bottom'} props.labelPlacement - ラベルの配置位置
 * @param {Object} props.sx - MUIのスタイルオブジェクト（FormControlLabel に適用）
 * @param {boolean} props.is_debug - デバッグログ出力フラグ（有効時に props をログ出力）
 * @returns {JSX.Element} カスタムスイッチ
 */

const DEFAULT_STYLE = {
  mt: 1.5, // margin-top: 12px
};

const CustomSwitch = (props) => {
  const { is_debug, ...restParams } = props;

  // デバッグモード時のログ出力
  if (is_debug) {
    log.debug("IconMenu Props:", {
      is_debug,
      ...restParams,
    });
  }

    const {
      id,
      name,
      checked,
      defaultChecked,
      size,
      color,
      onChange,
      disabled,
      disableRipple,
      required,
      label,
      labelPlacement,
      sx
    } = {
        ...default_params.common,
        ...default_params.switch,
        ...restParams,
      };

      return (
        <FormControlLabel
          control={
            <Switch
              id={id}
              name={name}
              checked={checked}
              defaultChecked={defaultChecked}
              size={size}
              color={color}
              onChange={onChange}
              disabled={disabled}
              disableRipple={disableRipple}
            />
          }
          sx={{ ...DEFAULT_STYLE, ...sx }}
          disabled={disabled}
          label={label}
          labelPlacement={labelPlacement}
        />
      );
    };

  /**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
CustomSwitch.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  color: PropTypes.oneOf(['primary', 'secondary', 'default', 'error', 'info', 'success', 'warning']),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  disableRipple: PropTypes.bool,
  label: PropTypes.node,
  labelPlacement: PropTypes.oneOf(['end', 'start', 'top', 'bottom']),
  sx: PropTypes.object,
  is_debug: PropTypes.bool,
};

export default CustomSwitch;
