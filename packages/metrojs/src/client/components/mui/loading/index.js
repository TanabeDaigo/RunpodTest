/**
 * ローディングインジケータコンポーネント
 *
 * Material-UIのCircularProgressコンポーネントをラップし、以下の機能を提供:
 * - 画面全体をカバーするオーバーレイ表示
 * - 半透明の背景色
 * - 中央配置のローディングインジケータ
 * - カスタマイズされたサイズ設定
 *
 * @component
 */

"use client";
import React from "react";
import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

import { styled } from "@mui/system";

const OVERLAY_STYLES = {
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const PROGRESS_STYLES = {
  root: {
    width: "50px !important",
    height: "50px !important",
  },
};

const Overlay = styled("div")(({ overlayColor, zIndex }) => ({
  ...OVERLAY_STYLES.root,
  backgroundColor: overlayColor,
  zIndex: zIndex,
}));

const StyledCircularProgress = styled(CircularProgress)(({ size, color }) => ({
  ...PROGRESS_STYLES.root,
  width: `${size}px !important`,
  height: `${size}px !important`,
  color: color,
}));

const DEFAULT_LOADING_PROPS = {
  size: 40,
  color: "primary",
  overlayColor: "rgba(255, 255, 255, 0.7)",
  zIndex: 1000,
  show: true,
};

export const TEST_IDS = {
  LOADING: "loading",
  PROGRESS: "loading-progress",
};

const Loading = React.memo(
  ({
    size = DEFAULT_LOADING_PROPS.size,
    color = DEFAULT_LOADING_PROPS.color,
    overlayColor = DEFAULT_LOADING_PROPS.overlayColor,
    zIndex = DEFAULT_LOADING_PROPS.zIndex,
    ariaLabel = "読み込み中",
    testId = TEST_IDS.LOADING,
    show = DEFAULT_LOADING_PROPS.show,
  }) => {
    if (!show) {
      return null;
    }

    return (
      <Overlay
        overlayColor={overlayColor}
        zIndex={zIndex}
        role="alert"
        aria-live="polite"
        data-testid={testId}
      >
        <StyledCircularProgress
          size={size}
          color={color}
          aria-label={ariaLabel}
          data-testid={TEST_IDS.PROGRESS}
        />
      </Overlay>
    );
  }
);

Loading.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  overlayColor: PropTypes.string,
  zIndex: PropTypes.number,
  ariaLabel: PropTypes.string,
  testId: PropTypes.string,
  show: PropTypes.bool,
};

export default Loading;
