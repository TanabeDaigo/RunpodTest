"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import logjs from "@metrojs/logjs";

const log = new logjs("CustomTooltip");

const _DEFAULT_STYLE = {
  fontSize: 12,
  maxWidth: 300,
  whiteSpace: "pre-line",
};

const CustomTooltip = (props) => {
  const {
    id,
    value,
    title,
    children,
    placement,
    arrow,
    enterDelay,
    leaveDelay,
    is_debug,
    sx,
    arrowSx,         
    disabled,
    ...rest
  } = props;

  if (is_debug) {
    log.debug("Tooltip Props:", {
      id,
      title,
      placement,
      arrow,
      disabled,
      rest,
    });
  }

  // title が無ければそのまま返す
  if (!title) {
    return children;
  }

  // disabled 要素対策
  const child = disabled ? <span>{children}</span> : children;

  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      slotProps={{
        tooltip: {
          sx: {
            ..._DEFAULT_STYLE,
            ...sx,
          },
        },
        arrow: {
          sx: arrowSx,
        },
      }}
      {...rest}
    >
      {child}
    </Tooltip>
  );
};

CustomTooltip.displayName = "CustomTooltip";

CustomTooltip.propTypes = {
  id: PropTypes.string,
  value: PropTypes.any,
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  placement: PropTypes.oneOf([
    "top",
    "bottom",
    "left",
    "right",
    "top-start",
    "top-end",
    "bottom-start",
    "bottom-end",
    "left-start",
    "left-end",
    "right-start",
    "right-end",
  ]),
  arrow: PropTypes.bool,
  enterDelay: PropTypes.number,
  leaveDelay: PropTypes.number,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
  arrowSx: PropTypes.object, 
  is_debug: PropTypes.bool,
};

CustomTooltip.defaultProps = {
  placement: "top",
  arrow: true,
  enterDelay: 300,
  leaveDelay: 0,
  disabled: false,
  arrowSx: undefined,
};

export default CustomTooltip;
