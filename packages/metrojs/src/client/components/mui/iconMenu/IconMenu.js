/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom IconMenu Component                         ║
 * ║   Copyright (c) 2025 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful icon menu component built with      ║
 * ║   Material-UI, providing seamless user interaction            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file IconMenu.js
 * @description カスタムアイコンメニューコンポーネント
 *
 * Material-UIのIconMenuコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - propsの受け渡し
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";

import React from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from '@mui/material/MenuItem';
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { default_params } from "../default_params.js";
import logjs from "@metrojs/logjs";

const log = new logjs("IconMenu");
/**
 * カスタムアイコンメニューコンポーネント
 * Material-UI の IconButton + Menu をベースにしたカスタムメニュー
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.id - アイコンボタンの一意なID
 * @param {string} props.name - アクセシビリティ用ラベル
 * @param {boolean} props.disabled - ボタンの無効化フラグ
 * @param {string} props.tooltip - ツールチップのテキスト
 * @param {boolean} props.show - メニュー表示を有効にするかどうか
 * @param {string} props.color - アイコンの色（例: "default", "primary", "secondary", etc）
 * @param {string} props.fontSize - アイコンのサイズ（"small", "medium", "large", etc）
 * @param {Function} props.onClick - ボタンクリック時の処理
 * @param {Function} props.onChange - メニュー選択時のコールバック `(event, selectedValue)`
 * @param {Array} props.options - メニューの選択肢配列（各要素は `{ value, disabled?, selected? }`）
 * @param {string} props.value - 現在選択されている値（初期値）
 * @param {Function} props.after_func - 値変更後の追加処理（未使用、将来用）
 * @param {Object} props.sx - スタイルオブジェクト（MenuItem に適用）
 * @param {boolean} props.is_debug - デバッグモード（ログ出力用）
 * @returns {JSX.Element|null} カスタムアイコンメニュー
 */

const CustomIconMenu = (props) => {
  const { is_debug, ...restParams } = props;

  // デバッグモード時のログ出力
  if (is_debug) {
    log.debug("IconMenu Props:", {
      is_debug,
      ...restParams,
    });
  }

  const {
    children,
    tooltip,
    show,
    id,
    name,
    disabled,
    color,
    fontSize,
    onClick,
    sx,
    after_func,
    onChange,
    anchorOrigin,
    transformOrigin,
    options = [],
    value: initialValue,
  } = {
      ...default_params.common,
      ...default_params.iconMenu,
      ...restParams,
    };

  const _log = (msg) => is_debug && log.debug(`id:${id} ${msg}`);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [value, setValue] = React.useState(initialValue || "");

  React.useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (selectedValue) => (e) => {
    _log(`selected value: ${selectedValue}`);
    handleClose();
    setValue(selectedValue);
    if (onChange) onChange(e, selectedValue);
  };

  const iconButton = (
    <IconButton
      onClick={handleClick}
      id={id}
      aria-label={name}
      disabled={disabled}
    >
      <MoreVertIcon color={color} fontSize={fontSize} />
    </IconButton>
  );

  const iconButtonElement = tooltip ? (
    <Tooltip title={tooltip} placement="bottom-start">
      {iconButton}
    </Tooltip>
  ) : (
    iconButton
  );

  return (
    show && (
      <div>
        {iconButtonElement}
        <Menu
         anchorEl={anchorEl}
         open={open}
         onClose={handleClose}
         anchorOrigin={anchorOrigin}
         transformOrigin={transformOrigin}
         >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              onClick={(e) => {
                if (option.onClick) {
                  option.onClick(e);
                } else {
                  handleSelect(option.value)(e);
                }
              }}
              disabled={option.disabled}
              sx={sx}
            >
              {option.value}
            </MenuItem>
            ))}
          </Menu>
        </div>
      )
    );
  };

CustomIconMenu.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
  show: PropTypes.bool,
  color: PropTypes.oneOf([
    "inherit", "primary", "secondary", "default", "error", "info", "success", "warning"
  ]),
  fontSize: PropTypes.oneOf(["inherit", "small", "medium", "large"]),
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  value: PropTypes.string,
  after_func: PropTypes.func,
  sx: PropTypes.object,
  is_debug: PropTypes.bool,
};

export default CustomIconMenu;