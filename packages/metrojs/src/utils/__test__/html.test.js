/**
 * =========================================================================
 * MetroJS HTML Utility Test Suite
 * =========================================================================
 *
 * HTML文字列操作ユーティリティのテストスイート
 * 改行文字やbrタグの変換処理を検証
 *
 * Copyright (c) 2024 Metro Digital Solutions
 * All rights reserved.
 *
 * @author Metro Development Team
 * @version 1.0.0
 * @license MIT
 * =========================================================================
 */

import { nl2br, breakLine } from "../html.js";
import React from "react";

describe("nl2br", () => {
  test("nullの場合はnullを返す", () => {
    expect(nl2br(null)).toBe(null); // nullが入力された場合、nullが返されることを確認
  });

  test("文字列以外の場合は元の値を返す", () => {
    expect(nl2br(123)).toBe(123); // 数値が入力された場合、そのまま返されることを確認
    expect(nl2br({})).toEqual({}); // オブジェクトが入力された場合、そのまま返されることを確認
    expect(nl2br([])).toEqual([]); // 配列が入力された場合、そのまま返されることを確認
  });

  test("改行を含む文字列をbr要素に変換する", () => {
    const result = nl2br("Hello\nWorld");
    expect(result).toEqual(["Hello", <br key="1" />, "World"]); // 改行が正しくbr要素に変換されることを確認
  });

  test("複数の改行を含む文字列をbr要素に変換する", () => {
    const result = nl2br("Hello\nWorld\nTest");
    expect(result).toEqual([
      "Hello",
      <br key="1" />,
      "World",
      <br key="3" />,
      "Test",
    ]); // 複数の改行が正しくbr要素に変換されることを確認
  });

  test("改行を含まない文字列はそのまま返す", () => {
    const result = nl2br("Hello World");
    expect(result).toBe("Hello World"); // 改行を含まない文字列がそのまま返されることを確認
  });
});

describe("breakLine", () => {
  test("brタグを含む文字列をReact要素に変換する", () => {
    const result = breakLine("Hello<br />World");
    expect(result).toEqual(["Hello", <br key="key_1" />, "World"]); // brタグが正しくReact要素に変換されることを確認
  });

  test("複数のbrタグを含む文字列をReact要素に変換する", () => {
    const result = breakLine("Hello<br />World<br />Test");
    expect(result).toEqual([
      "Hello",
      <br key="key_1" />,
      "World",
      <br key="key_3" />,
      "Test",
    ]); // 複数のbrタグが正しくReact要素に変換されることを確認
  });

  test("brタグを含まない文字列はそのまま返す", () => {
    const result = breakLine("Hello World");
    expect(result).toEqual(["Hello World"]); // brタグを含まない文字列が配列として返されることを確認
  });

  test("空文字列の場合は空の配列を返す", () => {
    const result = breakLine("");
    expect(result).toEqual([""]); // 空文字列が空の配列として返されることを確認
  });
});
