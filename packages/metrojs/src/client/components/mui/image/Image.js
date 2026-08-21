/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Image Component                            ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful image component built with         ║
 * ║   Next.js Image, providing optimized image handling          ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * カスタム画像コンポーネント
 *
 * Next.jsのImageコンポーネントをラップし、以下の機能を提供:
 * - デフォルトパラメータの適用
 * - エラーハンドリング
 * - ローディング状態の管理
 * - カスタムスタイルの適用
 * - クリックイベントの処理
 *
 * @component
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.src - 画像のソースURL
 * @param {string} props.alt - 代替テキスト
 * @param {number} props.width - 画像の幅
 * @param {number} props.height - 画像の高さ
 * @param {boolean} props.fill - 親要素を埋める
 * @param {boolean} props.priority - 優先読み込み
 * @param {number} props.quality - 画像品質（1-100）
 * @param {string} props.placeholder - プレースホルダー（blur/empty）
 * @param {string} props.blurDataURL - ブラー画像のデータURL
 * @param {string} props.sizes - レスポンシブ画像のサイズ
 * @param {Function} props.loader - カスタムローダー関数
 * @param {boolean} props.unoptimized - 最適化を無効化
 * @param {Object} props.style - カスタムスタイル
 * @param {string} props.className - CSSクラス名
 * @param {Function} props.onLoad - 読み込み完了時のコールバック
 * @param {Function} props.onError - エラー時のコールバック
 * @param {Function} props.onClick - クリック時のコールバック
 * @param {boolean} props.is_debug - デバッグモード
 * @returns {JSX.Element} カスタマイズされた画像コンポーネント
 */

"use client";
import * as React from "react";
import PropTypes from "prop-types";
import NextImage from "next/image";
import { default_params } from "../default_params.js";
import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import logjs from "@metrojs/logjs";

const log = new logjs("Image");

// スタイル定義
const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  "& .image-loading": {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
  },
  "& .image-error": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.grey[100],
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    minHeight: "100px",
    color: theme.palette.text.secondary,
  },
  "& .image-wrapper": {
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
  },
}));

const CustomImage = (props) => {
  const { is_debug, after_func: _after_func, ...restParams } = props;

  if (is_debug != false) {
    log.debug(`Image src:${props.src} Props:`, {
      is_debug,
      ...restParams,
    });
  }

  const {
    src,
    alt,
    width,
    height,
    fill,
    priority,
    quality,
    placeholder,
    blurDataURL,
    sizes,
    loader,
    unoptimized,
    style,
    className,
    onLoad,
    onError,
    onClick,
    showLoading = true,
    showError = true,
    errorText = "画像を読み込めませんでした",
    ...rest
  } = {
    ...default_params.common,
    ...default_params.image,
    ...restParams,
  };

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const _log = (message) => {
    if (is_debug) {
      log.debug(`Image src:${src} ${message}`);
    }
  };

  _log(`Image src:${src} loading:${loading} error:${error}`);

  // 画像読み込み完了時のハンドラー
  const handleLoad = (event) => {
    _log(`handleLoad src:${src}`);
    setLoading(false);
    setImageLoaded(true);
    if (onLoad) {
      onLoad(event);
    }
  };

  // 画像エラー時のハンドラー
  const handleError = (event) => {
    _log(`handleError src:${src}`);
    setLoading(false);
    setError(true);
    if (onError) {
      onError(event);
    }
  };

  // クリック時のハンドラー
  const handleClick = (event) => {
    _log(`handleClick src:${src}`);
    if (onClick) {
      onClick(event);
    }
  };

  // エラー表示コンポーネント
  const ErrorDisplay = () => (
    <Box className="image-error" sx={{ width: width || "100%", height: height || "200px" }}>
      <Typography variant="body2" color="text.secondary">
        {errorText}
      </Typography>
    </Box>
  );

  // ローディング表示コンポーネント
  const LoadingDisplay = () => (
    <Box className="image-loading">
      <CircularProgress size={24} />
    </Box>
  );

  // srcが提供されていない場合のエラー表示
  if (!src) {
    _log(`No src provided`);
    return <ErrorDisplay />;
  }

  return (
    <ImageContainer className={className} style={style} onClick={handleClick} sx={{ cursor: onClick ? "pointer" : "default" }}>
      {loading && showLoading && <LoadingDisplay />}
      {error && showError ? (
        <ErrorDisplay />
      ) : (
        <Box className="image-wrapper">
          <NextImage
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            priority={priority}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            sizes={sizes}
            loader={loader}
            unoptimized={unoptimized}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              ...(fill ? { objectFit: "cover" } : {}),
            }}
            {...rest}
          />
        </Box>
      )}
    </ImageContainer>
  );
};

CustomImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.bool,
  priority: PropTypes.bool,
  quality: PropTypes.number,
  placeholder: PropTypes.oneOf(["blur", "empty"]),
  blurDataURL: PropTypes.string,
  sizes: PropTypes.string,
  loader: PropTypes.func,
  unoptimized: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onClick: PropTypes.func,
  showLoading: PropTypes.bool,
  showError: PropTypes.bool,
  errorText: PropTypes.string,
  is_debug: PropTypes.bool,
};

export default CustomImage;
