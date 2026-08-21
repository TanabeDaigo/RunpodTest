/**
 * =========================================================================
 * MetroJS String Utility Test Suite
 * =========================================================================
 *
 * 文字列操作ユーティリティのテストスイート
 * 各種文字列変換とフォーマット処理の検証を行う
 *
 * Copyright (c) 2024 Metro Digital Solutions
 * All rights reserved.
 *
 * @author Metro Development Team
 * @version 1.0.0
 * @license MIT
 * =========================================================================
 */

import {
  camelCase,
  pascalCase,
  snakeCase,
  kebabCase,
  titleCase,
  sentenceCase,
  words,
  upperFirst,
  replaceAll,
  replaceAlphaNumOnly,
  replaceNumberOnly,
  toBoolean,
  split,
  join,
  trim,
  toUpperCase,
  toLowerCase,
  length,
  truncate,
  replace,
  matches,
  repeat,
  padStart,
  padEnd,
} from "../string.js";

// camelCase関数のテスト
describe("camelCase", () => {
  test("文字列をキャメルケースに変換する", () => {
    expect(camelCase("hello world")).toBe("helloWorld"); // 文字列が"helloWorld"と完全一致することを確認
    expect(camelCase("hello-world")).toBe("helloWorld"); // ハイフン区切りの文字列が"helloWorld"と完全一致することを確認
    expect(camelCase("hello_world")).toBe("helloWorld"); // アンダースコア区切りの文字列が"helloWorld"と完全一致することを確認
    expect(camelCase("HelloWorld")).toBe("helloWorld"); // パスカルケースの文字列が"helloWorld"と完全一致することを確認
  });
});

// pascalCase関数のテスト
describe("pascalCase", () => {
  test("文字列をパスカルケースに変換する", () => {
    expect(pascalCase("hello world")).toBe("HelloWorld"); // 文字列が"HelloWorld"と完全一致することを確認
    expect(pascalCase("hello-world")).toBe("HelloWorld"); // ハイフン区切りの文字列が"HelloWorld"と完全一致することを確認
    expect(pascalCase("hello_world")).toBe("HelloWorld"); // アンダースコア区切りの文字列が"HelloWorld"と完全一致することを確認
    expect(pascalCase("helloWorld")).toBe("HelloWorld"); // キャメルケースの文字列が"HelloWorld"と完全一致することを確認
  });
});

// snakeCase関数のテスト
describe("snakeCase", () => {
  test("文字列をスネークケースに変換する", () => {
    expect(snakeCase("hello world")).toBe("hello_world"); // 文字列が"hello_world"と完全一致することを確認
    expect(snakeCase("hello-world")).toBe("hello_world"); // ハイフン区切りの文字列が"hello_world"と完全一致することを確認
    expect(snakeCase("helloWorld")).toBe("hello_world"); // キャメルケースの文字列が"hello_world"と完全一致することを確認
    expect(snakeCase("HelloWorld")).toBe("hello_world"); // パスカルケースの文字列が"hello_world"と完全一致することを確認
  });
});

// kebabCase関数のテスト
describe("kebabCase", () => {
  test("文字列をケバブケースに変換する", () => {
    expect(kebabCase("hello world")).toBe("hello-world"); // 文字列が"hello-world"と完全一致することを確認
    expect(kebabCase("hello_world")).toBe("hello-world"); // アンダースコア区切りの文字列が"hello-world"と完全一致することを確認
    expect(kebabCase("helloWorld")).toBe("hello-world"); // キャメルケースの文字列が"hello-world"と完全一致することを確認
    expect(kebabCase("HelloWorld")).toBe("hello-world"); // パスカルケースの文字列が"hello-world"と完全一致することを確認
  });
});

// titleCase関数のテスト
describe("titleCase", () => {
  test("文字列をタイトルケースに変換する", () => {
    expect(titleCase("hello world")).toBe("Hello World"); // 文字列が"Hello World"と完全一致することを確認
    expect(titleCase("hello-world")).toBe("Hello World"); // ハイフン区切りの文字列が"Hello World"と完全一致することを確認
    expect(titleCase("hello_world")).toBe("Hello World"); // アンダースコア区切りの文字列が"Hello World"と完全一致することを確認
    expect(titleCase("helloWorld")).toBe("Hello World"); // キャメルケースの文字列が"Hello World"と完全一致することを確認
  });
});

// sentenceCase関数のテスト
describe("sentenceCase", () => {
  test("文字列を文章ケースに変換する", () => {
    expect(sentenceCase("hello world")).toBe("Hello world"); // 文字列が"Hello world"と完全一致することを確認
    expect(sentenceCase("hello-world")).toBe("Hello world"); // ハイフン区切りの文字列が"Hello world"と完全一致することを確認
    expect(sentenceCase("hello_world")).toBe("Hello world"); // アンダースコア区切りの文字列が"Hello world"と完全一致することを確認
    expect(sentenceCase("helloWorld")).toBe("Hello world"); // キャメルケースの文字列が"Hello world"と完全一致することを確認
  });
});

// words関数のテスト
describe("words", () => {
  test("文字列を単語配列に分割する", () => {
    expect(words("hello world")).toEqual(["hello", "world"]); // 文字列が["hello", "world"]配列と完全一致することを確認
    expect(words("hello-world")).toEqual(["hello", "world"]); // ハイフン区切りの文字列が["hello", "world"]配列と完全一致することを確認
    expect(words("hello_world")).toEqual(["hello", "world"]); // アンダースコア区切りの文字列が["hello", "world"]配列と完全一致することを確認
    expect(words("helloWorld")).toEqual(["hello", "world"]); // キャメルケースの文字列が["hello", "world"]配列と完全一致することを確認
  });
});

// upperFirst関数のテスト
describe("upperFirst", () => {
  test("文字列の最初の文字を大文字にする", () => {
    expect(upperFirst("hello")).toBe("Hello"); // 文字列が"Hello"と完全一致することを確認
    expect(upperFirst("world")).toBe("World"); // 文字列が"World"と完全一致することを確認
    expect(upperFirst("")).toBe(""); // 空文字列が空文字列と完全一致することを確認
    expect(upperFirst("a")).toBe("A"); // 単一文字が大文字の"A"と完全一致することを確認
  });
});

// replaceAll関数のテスト
describe("replaceAll", () => {
  test("文字列の全置換を行う", () => {
    expect(replaceAll("hello world", "o", "x")).toBe("hellx wxrld"); // "o"を"x"に置換した結果が"hellx wxrld"と完全一致することを確認
    expect(replaceAll("aaa", "a", "b")).toBe("bbb"); // "a"を"b"に置換した結果が"bbb"と完全一致することを確認
    expect(replaceAll("hello-world-test", "-", "_")).toBe("hello_world_test"); // ハイフンをアンダースコアに置換した結果が"hello_world_test"と完全一致することを確認
    expect(replaceAll("test test test", "test", "replaced")).toBe(
      "replaced replaced replaced"
    ); // "test"を"replaced"に置換した結果が"replaced replaced replaced"と完全一致することを確認
  });
});

// replaceAlphaNumOnly関数のテスト
describe("replaceAlphaNumOnly", () => {
  test("英数字のみを残して他の文字を削除する", () => {
    expect(replaceAlphaNumOnly("hello123!@#")).toBe("hello123"); // 特殊文字を削除した結果が"hello123"と完全一致することを確認
    expect(replaceAlphaNumOnly("テスト123abc")).toBe("123abc"); // 日本語を削除した結果が"123abc"と完全一致することを確認
    expect(replaceAlphaNumOnly("!@#$%^&*()")).toBe(""); // 特殊文字のみの文字列が空文字列になることを確認
    expect(replaceAlphaNumOnly("abc 123")).toBe("abc 123"); // スペースを含む英数字が保持されることを確認
  });

  test("記号を許可する場合", () => {
    expect(replaceAlphaNumOnly("hello123!@#", true)).toBe("hello123!@#"); // 記号を許可した場合に元の文字列と完全一致することを確認
    expect(replaceAlphaNumOnly("test@example.com", true)).toBe(
      "test@example.com"
    ); // メールアドレス形式が保持されることを確認
    expect(replaceAlphaNumOnly("abc!123#def", true)).toBe("abc!123#def"); // 英数字と記号が混在する文字列が保持されることを確認
  });
});

// replaceNumberOnly関数のテスト
describe("replaceNumberOnly", () => {
  test("数字のみを残して他の文字を削除する", () => {
    expect(replaceNumberOnly("abc123def")).toBe("123"); // 英字を削除した結果が"123"と完全一致することを確認
    expect(replaceNumberOnly("テスト123テスト")).toBe("123"); // 日本語を削除した結果が"123"と完全一致することを確認
    expect(replaceNumberOnly("!@#456^&*")).toBe("456"); // 特殊文字を削除した結果が"456"と完全一致することを確認
    expect(replaceNumberOnly("no numbers")).toBe(""); // 数字を含まない文字列が空文字列になることを確認
  });
});

// toBoolean関数のテスト
describe("toBoolean", () => {
  test("文字列をブール値に変換する", () => {
    expect(toBoolean("true")).toBe(true); // "true"文字列がtrueに変換されることを確認
    expect(toBoolean("false")).toBe(false); // "false"文字列がfalseに変換されることを確認
    expect(toBoolean("True")).toBe(false); // 大文字を含む"True"文字列がfalseに変換されることを確認
    expect(toBoolean("FALSE")).toBe(false); // 大文字の"FALSE"文字列がfalseに変換されることを確認
    expect(toBoolean("")).toBe(false); // 空文字列がfalseに変換されることを確認
  });
});

describe("文字列操作関数", () => {
  describe("split", () => {
    test("文字列を指定した区切り文字で分割する", () => {
      expect(split("a,b,c", ",")).toEqual(["a", "b", "c"]);
      expect(split("a b c", " ")).toEqual(["a", "b", "c"]);
    });

    test("nullの場合は空配列を返す", () => {
      expect(split(null, ",")).toEqual([]);
    });
  });

  describe("join", () => {
    test("配列の要素を指定した区切り文字で結合する", () => {
      expect(join(["a", "b", "c"], ",")).toBe("a,b,c");
      expect(join(["a", "b", "c"], " ")).toBe("a b c");
    });

    test("nullの場合は空文字列を返す", () => {
      expect(join(null, ",")).toBe("");
    });
  });

  describe("trim", () => {
    test("文字列の前後の空白を削除する", () => {
      expect(trim("  abc  ")).toBe("abc");
      expect(trim("  abc")).toBe("abc");
      expect(trim("abc  ")).toBe("abc");
    });

    test("nullの場合は空文字列を返す", () => {
      expect(trim(null)).toBe("");
    });
  });

  describe("toUpperCase", () => {
    test("文字列を大文字に変換する", () => {
      expect(toUpperCase("abc")).toBe("ABC");
      expect(toUpperCase("Abc")).toBe("ABC");
    });

    test("nullの場合は空文字列を返す", () => {
      expect(toUpperCase(null)).toBe("");
    });
  });

  describe("toLowerCase", () => {
    test("文字列を小文字に変換する", () => {
      expect(toLowerCase("ABC")).toBe("abc");
      expect(toLowerCase("Abc")).toBe("abc");
    });

    test("nullの場合は空文字列を返す", () => {
      expect(toLowerCase(null)).toBe("");
    });
  });

  describe("length", () => {
    test("文字列の長さを返す", () => {
      expect(length("abc")).toBe(3);
      expect(length("")).toBe(0);
    });

    test("nullの場合は0を返す", () => {
      expect(length(null)).toBe(0);
    });
  });

  describe("truncate", () => {
    test("文字列を指定した長さで切り詰める", () => {
      expect(truncate("abcdef", 3)).toBe("abc...");
      expect(truncate("abcdef", 3, "...")).toBe("abc...");
    });

    test("nullの場合は空文字列を返す", () => {
      expect(truncate(null, 3)).toBe("");
    });
  });

  describe("replace", () => {
    test("文字列の置換を行う", () => {
      expect(replace("abc", "a", "x")).toBe("xbc");
      expect(replace("abcabc", "a", "x")).toBe("xbcabc");
    });

    test("nullの場合は空文字列を返す", () => {
      expect(replace(null, "a", "x")).toBe("");
    });
  });

  describe("matches", () => {
    test("正規表現に一致するかどうかを判定する", () => {
      expect(matches("abc", /^[a-z]+$/)).toBe(true);
      expect(matches("123", /^[a-z]+$/)).toBe(false);
    });

    test("nullの場合はfalseを返す", () => {
      expect(matches(null, /^[a-z]+$/)).toBe(false);
    });
  });

  describe("repeat", () => {
    test("文字列を指定回数繰り返す", () => {
      expect(repeat("a", 3)).toBe("aaa");
      expect(repeat("abc", 2)).toBe("abcabc");
    });

    test("nullの場合は空文字列を返す", () => {
      expect(repeat(null, 3)).toBe("");
    });
  });

  describe("padStart", () => {
    test("文字列の先頭を指定した文字で埋める", () => {
      expect(padStart("abc", 5, "x")).toBe("xxabc");
      expect(padStart("abc", 5)).toBe("  abc");
    });

    test("nullの場合は空文字列を返す", () => {
      expect(padStart(null, 5, "x")).toBe("");
    });
  });

  describe("padEnd", () => {
    test("文字列の末尾を指定した文字で埋める", () => {
      expect(padEnd("abc", 5, "x")).toBe("abcxx");
      expect(padEnd("abc", 5)).toBe("abc  ");
    });

    test("nullの場合は空文字列を返す", () => {
      expect(padEnd(null, 5, "x")).toBe("");
    });
  });
});
