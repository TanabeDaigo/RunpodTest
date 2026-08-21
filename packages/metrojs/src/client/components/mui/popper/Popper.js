"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import logjs from "@metrojs/logjs";

const log = new logjs("CustomPopper");

const _DEFAULT_STYLE = {
  fontSize: 12,
  maxWidth: 300,
  padding: "8px 12px",
  whiteSpace: "pre-line",
  borderRadius: 4,
  boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
  backgroundColor: "#fff",
};

/**
 * CustomPopper
 * Tooltip と同じ感覚で使える Popper
 */
const CustomPopper = (props) => {
  const {
    id,
    value,
    children,
    placement = "bottom",
    is_debug = false,
    sx,
    disabled = false,
    ...rest
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popperId = open ? id : undefined;

  if (is_debug) {
    log.debug("Popper Props:", {
      id,
      placement,
      open,
      anchorEl,
    });
  }

  // children の onClick を壊さずに合成
  const child = React.isValidElement(children)
    ? React.cloneElement(children, {
        onClick: (e) => {
          children.props?.onClick?.(e);
          if (!disabled) {
            handleClick(e);
          }
        },
      })
    : (
        <span onClick={!disabled ? handleClick : undefined}>
          {children}
        </span>
      );

  return (
    <>
      {disabled ? <span>{child}</span> : child}

      <Popper
        id={popperId}
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        disablePortal
        {...rest}
      >
        <Fade in={open} timeout={200}>
          <Paper sx={{ ..._DEFAULT_STYLE, ...sx }}>
            {typeof value === "function"
              ? value({ onClose: handleClose })
              : value}
          </Paper>
        </Fade>
      </Popper>
    </>
  );
};

CustomPopper.displayName = "CustomPopper";

CustomPopper.propTypes = {
  id: PropTypes.string,
  value: PropTypes.node,
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
  sx: PropTypes.object,
  disabled: PropTypes.bool,
  is_debug: PropTypes.bool,
};

export default CustomPopper;
