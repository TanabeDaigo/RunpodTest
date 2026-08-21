/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Next.js Configuration                             ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   Next.jsアプリケーションの設定ファイル                      ║
 * ║   ビルド設定とパスエイリアス                                  ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはNext.jsアプリケーションの設定を定義します。
 * 主な機能：
 * - ベース設定の継承
 * - Webpack設定のカスタマイズ
 * - パスエイリアスの設定
 * - ビルド最適化
 *
 * @file next.config.mjs
 * @module next.config
 */

import baseConfig from "../../packages/typescript-config/next.config.base.mjs"; // ベースとなるNext.js設定をインポート
import path from "path"; // パス操作用モジュール
import { fileURLToPath } from "url"; // URL操作用モジュール
import withBundleAnalyzer from "@next/bundle-analyzer";
import TerserPlugin from "terser-webpack-plugin"; // Terserプラグインをインポート

const __filename = fileURLToPath(import.meta.url); // 現在のファイルの絶対パスを取得
const __dirname = path.dirname(__filename); // 現在のファイルのディレクトリパスを取得

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
  analyzerMode: "server",
  analyzerPort: process.env.ANALYZER_PORT || 8888,
  generateStatsFile: true,
  statsFilename: "stats.json",
  defaultSizes: "gzip",
  logLevel: "info",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseConfig, // ベース設定を展開
  // 画像設定を追加
  images: {
    // 外部ドメインの画像最適化を無効にする
    unoptimized: true,
    // または、特定のドメインのみ許可する場合
    // domains: ['sitecam.toda.co.jp'],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'sitecam.toda.co.jp',
    //     port: '',
    //     pathname: '/images/**',
    //   },
    // ],
  },
  // ビルドパフォーマンス最適化
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["info", "warn", "error", "table", "dir"],
          }
        : false,
    styledComponents: true,
  },
  experimental: {
    ...baseConfig.experimental,
    optimizeCss: true,
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
  // セキュリティヘッダーの設定
  async headers() {
    // 開発環境ではCSPを緩和
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value: [
                "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
                "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: blob:",
                "font-src 'self' data:",
                "connect-src 'self' https://openapi.safie.link",
                "media-src 'self'",
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'",
              ].join("; "),
            },
          ],
        },
      ];
    }

    // 本番環境でもSafieAPIを許可
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
  productionBrowserSourceMaps: true,
  webpack: (config, { dev, isServer }) => {
    // Webpack設定のカスタマイズ
    // パスエイリアスの設定（アプリケーション固有）
    config.resolve.alias = {
      ...config.resolve.alias, // 既存のエイリアスを保持
      "@": path.resolve(__dirname, "src"), // ソースディレクトリのルート
      "@utils": path.resolve(__dirname, "src/utils/index.js"), // ユーティリティ関数
      "@config": path.resolve(__dirname, "src/config"), // 設定ファイル
      "@components": path.resolve(__dirname, "src/components"), // コンポーネント
      "@hooks": path.resolve(__dirname, "src/hooks"), // カスタムフック
      "@html": path.resolve(__dirname, "src/html"), // HTMLテンプレート
      "@pages": path.resolve(__dirname, "src/pages"), // ページコンポーネント
      "@middlewares": path.resolve(__dirname, "src/middlewares"), // ミドルウェア
      "@server": path.resolve(__dirname, "src/server"), // サーバーサイドコード
      "@lib": path.resolve(__dirname, "src/lib"), // ライブラリ
      "@instrumentation": path.resolve(__dirname, "src/instrumentation.js"), // インストゥルメンテーション
      "@metrojs": "@krono-metro/metrojs", // MetroJSパッケージ
      "@common": "@repo/common", // 共通パッケージ
    };

    // AWS SDKをサーバーサイドのみに制限
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // AWS SDK関連のモジュールを無効化
        "@aws-sdk/client-s3": false,
        "@aws-sdk/client-ses": false,
        "@aws-sdk/client-sqs": false,
        "@aws-sdk/credential-providers": false,
        "@aws-sdk/core": false,
        "@aws-sdk/s3-request-presigner": false,
      };
    }

    // AWS SDKの警告を無視
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules\/@aws-sdk/,
        message: /A Node.js API is used.*which is not supported in the Edge Runtime/,
      },
      {
        module: /node_modules\/sequelize/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      // zlibモジュールのEdge Runtime警告を無視
      {
        module: /node_modules\/zlib/,
        message: /A Node.js module is loaded.*which is not supported in the Edge Runtime/,
      },
      {
        module: /packages\/metrojs\/src\/(server\/logic\/Compress|utils\/compress)\.js/,
        message: /A Node.js module is loaded.*which is not supported in the Edge Runtime/,
      },
      // iconv-liteとsafer-bufferのEdge Runtime警告を無視
      {
        module: /node_modules\/(iconv-lite|safer-buffer)/,
        message: /A Node.js (API|module) is used.*which is not supported in the Edge Runtime/,
      },
      {
        module: /packages\/metrojs\/src\/server\/service\/S3Service\.js/,
        message: /A Node.js (API|module) is used.*which is not supported in the Edge Runtime/,
      },
    ];

    // Sequelizeの動的インポート警告を無視する設定
    // ビルドパフォーマンス最適化
    if (!isServer) {
      if (process.env.ANALYZE !== "true") {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: "all",
            // Webpack5の新しいサイズ設定を適用
            minSize: {
              javascript: 20000, // JSファイルの最小サイズ
              style: 10000, // CSSファイルの最小サイズ
            },
            maxSize: 244000,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                  if (!module.context) return "vendor";
                  const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                  return match ? `vendor.${match[1].replace("@", "")}` : "vendor";
                },
                // ベンダー用のサイズ設定
                minSize: {
                  javascript: 30000, // ベンダーモジュールは少し大きめに
                  style: 5000,
                },
              },
            },
          },
        };
      } else {
        if (!dev && !isServer) {
          config.devtool = "source-map";
        }
      }
    }

    // 分析モード時のみ追加のチャンク分割設定を適用
    if (process.env.ANALYZE === "true" && !dev && !isServer) {
      // 既存のsplitChunks設定を保持
      const existingSplitChunks = config.optimization.splitChunks || {};

      config.optimization.splitChunks = {
        ...existingSplitChunks,
        chunks: "all",
        cacheGroups: {
          ...existingSplitChunks.cacheGroups,
          // ページごとのチャンク（分析用）
          pages: {
            name: "pages",
            test: /[\\/]app[\\/].*[\\/]page\.(js|jsx|ts|tsx)$/,
            chunks: "all",
            priority: 20,
          },
          // 共通コンポーネント（分析用）
          commons: {
            name: "commons",
            test: /[\\/]components[\\/]/,
            chunks: "all",
            priority: 10,
          },
          // その他のベンダーモジュール（分析用）
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority: 5,
          },
        },
      };
    }

    // reflect-metadataの読み込み順序を調整
    /*
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "reflect-metadata": path.resolve(__dirname, "node_modules/reflect-metadata"),
      };

      // reflect-metadataを最初に読み込むように設定
      config.entry = async () => {
        const entries = await config.entry();
        if (entries["main.js"] && !entries["main.js"].includes("reflect-metadata")) {
          entries["main.js"].unshift("reflect-metadata");
        }
        return entries;
      };
    }
    */

    // webpackキャッシュの最適化設定を追加
    // https://hiroppy.me/blog/webpack5/
    //if (!dev) {
    const currentCache = { ...config.cache };

    config.cache = {
      ...currentCache,
      // キャッシュの種類を指定
      type: "filesystem",

      // キャッシュディレクトリの設定
      //cacheDirectory: path.resolve(__dirname, ".next/cache/webpack"),

      // キャッシュの有効期限設定
      //maxAge: 1000 * 60 * 60 * 24 * 7, // 7日間

      // キャッシュの圧縮を有効化
      //compression: "gzip",

      // 大きなファイルの処理を最適化
      //profile: true,

      // キャッシュの詳細ログを無効化
      //logging: "error",

      // 大きな文字列の警告を抑制するための設定を追加
      buildDependencies: {
        ...(currentCache.buildDependencies || {}),
        config: [__filename],
      },
    };
    //}

    // ビルドパフォーマンスの最適化
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        // モジュールの結合を最適化
        concatenateModules: true,
        // 副作用のないモジュールの最適化
        sideEffects: false,
        // 使用されていないエクスポートの削除
        usedExports: true,
        // 大きな文字列の警告を抑制
        minimize: true,
        minimizer: [
          ...(config.optimization.minimizer || []),
          // Terserの設定で大きな文字列の警告を抑制
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: process.env.NODE_ENV === "production",
                drop_debugger: true,
              },
              format: {
                comments: false,
              },
            },
            extractComments: false,
          }),
        ],
      };
    }

    return config; // カスタマイズした設定を返す
  },

  // 画像パスをAPIルートにリライト
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: "/api/images/:path*",
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
