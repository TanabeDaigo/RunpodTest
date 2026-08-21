/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Next.js Base Configuration                        ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   Next.jsアプリケーションの基本設定ファイル                   ║
 * ║   ビルド最適化と開発環境設定                                  ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはNext.jsアプリケーションの基本設定を定義します。
 * 主な機能：
 * - バンドル分析の設定
 * - 実験的機能の有効化
 * - Webpack設定のカスタマイズ
 * - ビルド最適化
 * - パッケージのトランスパイル設定
 *
 * @file next.config.base.mjs
 * @module next.config.base
 */

import withBundleAnalyzer from "@next/bundle-analyzer"; // バンドル分析用プラグイン
import path from "path"; // パス操作用モジュール
import { fileURLToPath } from "url"; // URL操作用モジュール
import { createRequire } from "module"; // CommonJS requireの互換性用

const require = createRequire(import.meta.url); // CommonJSモジュール読み込み用
const __filename = fileURLToPath(import.meta.url); // 現在のファイルの絶対パス
const __dirname = path.dirname(__filename); // 現在のファイルのディレクトリパス

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true", // 環境変数でバンドル分析を制御
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Reactの厳格モードを有効化

  transpilePackages: ["@repo/common", "@krono-metro/metrojs"], // トランスパイル対象のパッケージ
  experimental: {
    // 実験的機能の設定
    serverActions: {
      // サーバーアクションの設定
      allowedOrigins: ["*"], // すべてのオリジンからのアクセスを許可
    },
    // Next.js 15ではcompiler.emotion: trueでネイティブサポートされているため、SWCプラグインは不要
    // swcPlugins: [["@swc/plugin-emotion", {}]], // EmotionのSWCプラグイン（無効化）
    //instrumentationHook: true, // インストゥルメンテーションフックを有効化(デフォルトでは有効化されている)
    optimizeCss: true, // CSSの最適化を有効化
    //decorators: true, // デコレータのサポートを有効化(デフォルトでは有効化されている)
    optimizePackageImports: ["@mui/material", "@mui/icons-material"], // パッケージインポートの最適化
  },
  //swcMinify: true, // SWCによるミニファイを有効化(デフォルトでは有効化されている)
  distDir: ".next", // ビルド出力ディレクトリ
  images: {
    // 画像最適化の設定
    domains: ["localhost"], // 許可する画像ドメイン
  },
  compiler: {
    // コンパイラ設定
    emotion: true, // Emotionのサポートを有効化
  },
  serverExternalPackages: ["pg", "sequelize", "pdf-parse"], // サーバーサイドで外部化するパッケージ
  typescript: {
    // TypeScript設定
    ignoreBuildErrors: true, // ビルド時のTypeScriptエラーを無視
  },
  eslint: {
    // ESLint設定
    ignoreDuringBuilds: true, // ビルド時のESLintチェックを無視
  },
  webpack: (config, { isServer }) => {
    // Webpack設定のカスタマイズ
    // テストファイルを除外
    config.module.rules.push({
      test: /\.test\.(js|jsx|ts|tsx)$/, // テストファイルのパターン
      loader: "ignore-loader", // テストファイルを無視
    });

    // __test__ディレクトリを除外
    config.module.rules.push({
      test: /__test__/, // テストディレクトリのパターン
      loader: "ignore-loader", // テストディレクトリを無視
    });

    // node_modules内のパス解決を改善
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"), // ローカルのnode_modules
      "node_modules", // プロジェクトのnode_modules
    ];

    // Sequelizeの動的インポートに関するワーニングを抑制
    config.module.exprContextCritical = false;

    // MUIのスタイル解決のための設定
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // ファイルシステムモジュールを無効化
        path: false, // パスモジュールを無効化
      };
    }

    // @mui/x-data-grid/styles.cssの読み込みを無効化
    config.resolve.alias["@mui/x-data-grid/styles.css"] = false;

    // _logエラーを解決するための設定
    config.resolve.fallback = {
      ...config.resolve.fallback,
      //_log: false, // _logモジュールを無効化
      fs: false, // ファイルシステムモジュールを無効化
      path: false, // パスモジュールを無効化
      crypto: false, // 暗号化モジュールを無効化
      stream: false, // ストリームモジュールを無効化
      http: false, // HTTPモジュールを無効化
      https: false, // HTTPSモジュールを無効化
      zlib: false, // 圧縮モジュールを無効化
    };

    // @emotion/reactの重複読み込みを防ぐ
    config.resolve.alias = {
      ...config.resolve.alias,
      "@emotion/react": path.resolve(__dirname, "node_modules/@emotion/react"),
      "@emotion/styled": path.resolve(__dirname, "node_modules/@emotion/styled"),
      "@emotion/cache": path.resolve(__dirname, "node_modules/@emotion/cache"),
    };

    return config; // カスタマイズした設定を返す
  },
};

export default bundleAnalyzer(nextConfig); // バンドル分析を適用して設定をエクスポート
