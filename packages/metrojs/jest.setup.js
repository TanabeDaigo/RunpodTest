// Jestのグローバル設定
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

// グローバルなモック設定
global.console = {
  ...console,
  // テスト中に特定のコンソールメッセージを無視する場合
  error: jest.fn(),
  warn: jest.fn(),
};

// テスト終了後のクリーンアップ
afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  // 非同期処理の完了を待機
  await new Promise((resolve) => setTimeout(resolve, 100));
});

// グローバルなタイムアウト設定
jest.setTimeout(30000);
