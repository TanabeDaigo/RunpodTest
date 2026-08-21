/**
 * =========================================================================
 * MetroJS System Utility Test Suite
 * =========================================================================
 *
 * システムユーティリティのテストスイート
 * - sleep: 処理の一時停止
 * - uuid: 一意識別子の生成
 * - isWindows: Windows環境の判定
 *
 * Copyright (c) 2024 Metro Digital Solutions
 * All rights reserved.
 *
 * @author Metro Development Team
 * @version 1.0.0
 * @license MIT
 * =========================================================================
 */

/**
 * @jest-environment node
 */

import { sleep, uuid, isWindows } from "../system.js";

describe("sleep", () => {
  test("指定されたミリ秒だけ処理を停止する", async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    const diff = end - start;

    // 100ミリ秒の誤差を許容
    expect(diff).toBeGreaterThanOrEqual(100); // 値が100以上であることを確認
    expect(diff).toBeLessThan(200); // 値が200未満であることを確認
  });

  test("0ミリ秒の場合は即座に終了する", async () => {
    const start = Date.now();
    await sleep(0);
    const end = Date.now();
    const diff = end - start;

    expect(diff).toBeLessThan(10); // 値が10未満であることを確認
  });
});

describe("uuid", () => {
  test("ハイフンなしの32文字の文字列を生成する", () => {
    const result = uuid();
    expect(result).toMatch(/^[0-9a-f]{32}$/); // 正規表現パターンにマッチすることを確認
  });

  test("複数回呼び出しても異なる値を生成する", () => {
    const uuid1 = uuid();
    const uuid2 = uuid();
    expect(uuid1).not.toBe(uuid2); // 2つの値が等しくないことを確認
  });
});

describe("isWindows", () => {
  // テスト環境をモック
  const originalNavigator = global.navigator;
  const originalWindow = global.window;
  const originalProcess = global.process;

  beforeEach(() => {
    // テスト前に環境をクリア
    delete global.navigator;
    delete global.window;
    delete global.process;
  });

  afterEach(() => {
    // テスト後に元の環境を復元
    global.navigator = originalNavigator;
    global.window = originalWindow;
    global.process = originalProcess;
  });

  test("Node.js環境でWindowsの場合はtrueを返す", () => {
    global.process = { platform: "win32" };
    expect(isWindows()).toBe(true);
  });

  test("Node.js環境でMacの場合はfalseを返す", () => {
    global.process = { platform: "darwin" };
    expect(isWindows()).toBe(false);
  });

  test("Node.js環境でLinuxの場合はfalseを返す", () => {
    global.process = { platform: "linux" };
    expect(isWindows()).toBe(false);
  });

  test("ブラウザ環境でWindowsの場合はtrueを返す", () => {
    Object.defineProperty(global, "window", {
      value: {},
      writable: true,
    });
    Object.defineProperty(global, "navigator", {
      value: { platform: "Win32" },
      writable: true,
    });
    expect(isWindows()).toBe(true);
  });

  test("ブラウザ環境でMacの場合はfalseを返す", () => {
    Object.defineProperty(global, "window", {
      value: {},
      writable: true,
    });
    Object.defineProperty(global, "navigator", {
      value: { platform: "MacIntel" },
      writable: true,
    });
    expect(isWindows()).toBe(false);
  });

  test("ブラウザ環境でLinuxの場合はfalseを返す", () => {
    Object.defineProperty(global, "window", {
      value: {},
      writable: true,
    });
    Object.defineProperty(global, "navigator", {
      value: { platform: "Linux x86_64" },
      writable: true,
    });
    expect(isWindows()).toBe(false);
  });

  test("環境が未定義の場合はfalseを返す", () => {
    expect(isWindows()).toBe(false);
  });
});
