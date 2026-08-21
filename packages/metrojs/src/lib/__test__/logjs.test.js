/**
 * =========================================
 *
 * Metrojs
 *
 * Copyright © 2019-present KronoMetro, Co.
 * All rights reserved.
 *
 * =========================================
 */

import { jest } from "@jest/globals";
import { logjs } from "../logjs";

describe("logjs", () => {
  let log;
  let originalEnv;
  let consoleLogMock;
  let consoleErrorMock;
  let consoleWarnMock;
  let consoleInfoMock;
  let consoleDirMock;
  let consoleTraceMock;
  let consoleTableMock;

  beforeEach(() => {
    // 環境変数の保存
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    // コンソールメソッドのモック
    consoleLogMock = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    consoleWarnMock = jest.spyOn(console, "warn").mockImplementation(() => {});
    consoleInfoMock = jest.spyOn(console, "info").mockImplementation(() => {});
    consoleDirMock = jest.spyOn(console, "dir").mockImplementation(() => {});
    consoleTraceMock = jest
      .spyOn(console, "trace")
      .mockImplementation(() => {});
    consoleTableMock = jest
      .spyOn(console, "table")
      .mockImplementation(() => {});

    // テスト用のlogインスタンスを作成
    log = new logjs("test-module");
  });

  afterEach(() => {
    // 環境変数を元に戻す
    process.env.NODE_ENV = originalEnv;

    // モックを復元
    consoleLogMock.mockRestore();
    consoleErrorMock.mockRestore();
    consoleWarnMock.mockRestore();
    consoleInfoMock.mockRestore();
    consoleDirMock.mockRestore();
    consoleTraceMock.mockRestore();
    consoleTableMock.mockRestore();
  });

  describe("constructor", () => {
    test("モジュール名が正しく設定される", () => {
      expect(log.module_name).toBe("test-module");
    });

    test("モジュールフォーマットが正しく生成される", () => {
      expect(log._moduleFormat).toBe("[test-module] - ");
    });
  });

  describe("debug", () => {
    test("開発環境ではログが出力される", () => {
      log.debug("デバッグメッセージ");
      expect(consoleLogMock).toHaveBeenCalled();
      expect(consoleLogMock.mock.calls[0][0]).toContain("DEBUG");
      expect(consoleLogMock.mock.calls[0][0]).toContain("デバッグメッセージ");
    });

    test("開発環境以外ではログが出力されない", () => {
      process.env.NODE_ENV = "production";
      log.debug("デバッグメッセージ");
      expect(consoleLogMock).not.toHaveBeenCalled();
    });

    test("追加データがある場合はconsole.dirが呼ばれる", () => {
      const data = { key: "value" };
      log.debug("デバッグメッセージ", data);
      expect(consoleDirMock).toHaveBeenCalledWith(data);
    });
  });

  describe("error", () => {
    test("エラーメッセージが正しく出力される", () => {
      log.error("エラーメッセージ");
      expect(consoleErrorMock).toHaveBeenCalled();
      expect(consoleErrorMock.mock.calls[0][0]).toContain("ERROR");
      expect(consoleErrorMock.mock.calls[0][0]).toContain("エラーメッセージ");
    });

    test("追加データがある場合はconsole.dirが呼ばれる", () => {
      const data = { code: 500, message: "Internal Server Error" };
      log.error("エラーメッセージ", data);
      expect(consoleDirMock).toHaveBeenCalledWith(data);
    });

    test("console.traceが呼ばれる", () => {
      log.error("エラーメッセージ");
      expect(consoleTraceMock).toHaveBeenCalled();
    });
  });

  describe("info", () => {
    test("情報メッセージが正しく出力される", () => {
      log.info("情報メッセージ");
      expect(consoleInfoMock).toHaveBeenCalled();
      expect(consoleInfoMock.mock.calls[0][0]).toContain("INFO");
      expect(consoleInfoMock.mock.calls[0][0]).toContain("情報メッセージ");
    });

    test("追加データがある場合はconsole.dirが呼ばれる", () => {
      const data = { userId: "123", action: "login" };
      log.info("情報メッセージ", data);
      expect(consoleDirMock).toHaveBeenCalledWith(data);
    });
  });

  describe("warn", () => {
    test("警告メッセージが正しく出力される", () => {
      log.warn("警告メッセージ");
      expect(consoleWarnMock).toHaveBeenCalled();
      expect(consoleWarnMock.mock.calls[0][0]).toContain("WARNING");
      expect(consoleWarnMock.mock.calls[0][0]).toContain("警告メッセージ");
    });

    test("追加データがある場合はconsole.dirが呼ばれる", () => {
      const data = { usage: "85%", threshold: "80%" };
      log.warn("警告メッセージ", data);
      expect(consoleDirMock).toHaveBeenCalledWith(data);
    });
  });

  describe("table", () => {
    test("開発環境ではテーブルが出力される", () => {
      const data = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      log.table("ユーザー一覧", data);
      expect(consoleTableMock).toHaveBeenCalledWith(data);
    });

    test("開発環境以外ではテーブルが出力されない", () => {
      process.env.NODE_ENV = "production";
      const data = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      log.table("ユーザー一覧", data);
      expect(consoleTableMock).not.toHaveBeenCalled();
    });
  });

  describe("エラーハンドリング", () => {
    test("console.logでエラーが発生した場合、console.errorが呼ばれる", () => {
      consoleLogMock.mockImplementationOnce(() => {
        throw new Error("テストエラー");
      });
      log.debug("デバッグメッセージ");
      expect(consoleErrorMock).toHaveBeenCalled();
    });
  });
});
