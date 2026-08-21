/** @type {import('jest').Config} */
const config = {
  // テスト環境の設定
  testEnvironment: "jsdom",

  // 詳細なログ出力を有効化
  silent: false,
  verbose: true,

  // 未解決の非同期処理を検出
  detectOpenHandles: true,

  // テストのタイムアウト設定（ミリ秒）
  testTimeout: 30000,

  // テストファイルのパターン
  testMatch: ["<rootDir>/src/**/__test__/**/*.test.[jt]s?(x)"],

  // モジュールの変換設定
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      {
        presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-react"],
      },
    ],
  },

  // モジュール名のマッピング
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // テスト実行前のセットアップファイル
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // 無視するパス
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],

  // モジュールの変換を無視するパターン
  transformIgnorePatterns: ["/node_modules/(?!(next|@babel/runtime)/)"],
};

export default config;
