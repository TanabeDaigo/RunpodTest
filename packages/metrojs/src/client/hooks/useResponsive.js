/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Responsive Hook                                   ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A powerful responsive design hook that provides            ║
 * ║   seamless breakpoint management for React applications      ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file useResponsive.js
 * @description レスポンシブデザイン用のカスタムフック
 *
 * 以下の機能を提供:
 * - Material-UIのブレークポイントに基づくレスポンシブ対応
 * - 複数のレスポンシブタイプ（up, down, only, not, between）のサポート
 * - テーマに基づく動的なメディアクエリの生成
 *
 * @example
 * // 基本的な使用方法
 * const isMobile = useResponsive({
 *   type: 'down',
 *   breakpoints: 'sm'
 * });
 *
 * // 範囲指定
 * const isTablet = useResponsive({
 *   type: 'between',
 *   startBreakpoints: 'sm',
 *   endBreakpoints: 'md'
 * });
 *
 * // 条件付きレンダリング
 * {isMobile ? <MobileView /> : <DesktopView />}
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import { useMediaQuery, useTheme } from "@mui/material";

/**
 * ブレークポイントの定義
 * @constant
 * @type {Object}
 */
const BREAKPOINTS = {
  XL: "xl",
  LG: "lg",
  MD: "md",
  SM: "sm",
  XS: "xs",
};

/**
 * レスポンシブタイプの定義
 * @constant
 * @type {Object}
 */
const RESPONSIVE_TYPES = {
  UP: "up",
  DOWN: "down",
  ONLY: "only",
  NOT: "not",
  BETWEEN: "between",
};

/**
 * レスポンシブ対応のためのカスタムフック
 * @param {Object} props - レスポンシブ設定
 * @param {string} props.type - レスポンシブタイプ（up, down, only, not, between）
 * @param {string} props.breakpoints - ブレークポイント（xl, lg, md, sm, xs）
 * @param {string} [props.startBreakpoints] - 範囲指定の開始ブレークポイント
 * @param {string} [props.endBreakpoints] - 範囲指定の終了ブレークポイント
 * @returns {boolean} メディアクエリにマッチするかどうか
 */
const useResponsive = (props) => {
  const theme = useTheme();

  const matches = useMediaQuery(() => {
    switch (props.type) {
      case RESPONSIVE_TYPES.BETWEEN:
        return theme.breakpoints.between(
          String(props.startBreakpoints),
          String(props.endBreakpoints)
        );
      case RESPONSIVE_TYPES.UP:
        return theme.breakpoints.up(String(props.breakpoints));
      case RESPONSIVE_TYPES.ONLY:
        return theme.breakpoints.only(String(props.breakpoints));
      case RESPONSIVE_TYPES.NOT:
        return theme.breakpoints.not(String(props.breakpoints));
      default:
        return theme.breakpoints.down(String(props.breakpoints));
    }
  });

  return matches;
};

export default useResponsive;
