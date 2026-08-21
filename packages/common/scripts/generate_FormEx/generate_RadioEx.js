/**
 * @file generate_RadioEx.js
 * @description データベーススキーマからuseRadioEx.jsを自動生成するスクリプト
 *
 * このスクリプトは、db_schema.jsのテーブルカラム情報を参照して、
 * 性別関連や権限関連のカラムを抽出し、useRadioEx.jsを自動生成します。
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @since 2024-12-19
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 性別関連の文字列を判定
 * @param {string} comment - コメント文字列
 * @returns {boolean} 性別関連かどうか
 */
const isGenderRelated = (comment) => {
  if (!comment) return false;
  const genderKeywords = ["性別", "男", "女", "男性", "女性"];
  return genderKeywords.some((keyword) => comment.includes(keyword));
};

/**
 * 権限関連の文字列を判定
 * @param {string} columnName - カラム名
 * @param {string} comment - コメント文字列
 * @returns {boolean} 権限関連かどうか
 */
const isAuthRelated = (columnName, comment) => {
  if (!columnName && !comment) return false;
  const authKeywords = ["auth", "権限", "管理者", "一般"];
  const targetString = `${columnName} ${comment}`.toLowerCase();
  return authKeywords.some((keyword) => targetString.includes(keyword.toLowerCase()));
};

/**
 * ラジオ関数名を生成
 * @param {string} columnName - カラム名
 * @returns {string} 関数名
 */
const generateFunctionName = (columnName) => {
  return `radio_${columnName}`;
};

/**
 * ラジオ関数のJSDocコメントを生成
 * @param {string} columnName - カラム名
 * @param {string} comment - コメント
 * @param {string} type - ラジオタイプ（gender, auth）
 * @returns {string} JSDocコメント
 */
const generateJSDoc = (columnName, comment, type) => {
  if (type === "gender") {
    return `  /**
   * 性別ラジオボタンを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 性別ラジオボタンのJSX要素
   */`;
  } else if (type === "auth") {
    return `  /**
   * ユーザー権限ラジオボタンを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ユーザー権限ラジオボタンのJSX要素
   */`;
  } else {
    return `  /**
   * ${comment}ラジオボタンを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ${comment}ラジオボタンのJSX要素
   */`;
  }
};

/**
 * ラジオ関数の実装を生成
 * @param {string} columnName - カラム名
 * @param {Object} columnInfo - カラム情報
 * @param {string} type - ラジオタイプ（gender, auth）
 * @returns {string} 関数の実装
 */
const generateFunction = (columnName, columnInfo, type) => {
  const functionName = generateFunctionName(columnName);
  const jsdoc = generateJSDoc(columnName, columnInfo.comment, type);

  let options, label;

  if (type === "gender") {
    options = `[
      {
        key: 1,
        value: 1,
        label: "男性",
      },
      {
        key: 2,
        value: 2,
        label: "女性",
      },
    ]`;
    label = "性別";
  } else if (type === "auth") {
    options = `[
      {
        key: 1,
        value: 1,
        label: "一般",
      },
      {
        key: 2,
        value: 2,
        label: "管理者",
      },
    ]`;
    label = "ユーザー権限";
  } else {
    // デフォルトのオプション
    options = `[
      {
        key: 1,
        value: 1,
        label: "オプション1",
      },
      {
        key: 2,
        value: 2,
        label: "オプション2",
      },
    ]`;
    label = columnInfo.comment || columnName;
  }

  return `${jsdoc}
  const ${functionName} = (params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(\`${functionName} form.${columnName}:\${form?.${columnName} || ""} params:\`, params);
      log.debug(\`${functionName} state.initData.${columnName}:\`, state.initData?.${columnName});
    }

    const options = ${options};

    return formProps.radio(
      "${columnName}",
      {
        label: "${label}",
        options: options,
        ...params,
      },
      is_debug
    );
  };`;
};

// コマンドライン引数を解析
function parseArgs() {
  const args = process.argv.slice(2);
  const force = args.includes("--force") || args.includes("-f");

  let schemaPathArg = null;
  let outputPathArg = null;

  args.forEach((arg, i) => {
    if (arg === "--schema" && args[i + 1] && !args[i + 1].startsWith("-")) {
      schemaPathArg = args[i + 1];
    }
    if (arg === "--out" && args[i + 1] && !args[i + 1].startsWith("-")) {
      outputPathArg = args[i + 1];
    }
  });

  const positionals = args.filter((a) => !a.startsWith("-"));
  if (!schemaPathArg && positionals[0]) schemaPathArg = positionals[0];
  if (!outputPathArg && positionals[1]) outputPathArg = positionals[1];

  return { force, schemaPathArg, outputPathArg };
}

/**
 * メイン処理
 */
const main = async () => {
  try {
    const { force, schemaPathArg, outputPathArg } = parseArgs();

    // useRadioEx.jsの出力パス
    const outputPath = outputPathArg ? path.resolve(outputPathArg) : path.join(__dirname, "../../src/client/hooks/FormEx/useRadioEx.js");

    // ファイルがすでに存在するかチェック
    if (fs.existsSync(outputPath) && !force) {
      console.log(`ℹ️  useRadioEx.jsはすでに存在しています: ${outputPath}`);
      console.log(`   処理をスキップします。`);
      console.log(`   上書きする場合は --force または -f オプションを使用してください。`);
      return;
    }

    if (fs.existsSync(outputPath) && force) {
      console.log(` 既存のuseRadioEx.jsを上書きします: ${outputPath}`);
    }

    // db_schema.jsを読み込み
    const schemaPath = schemaPathArg ? path.resolve(schemaPathArg) : path.join(__dirname, "../../src/server/db/schema/db_schema.js");
    const schemaContent = fs.readFileSync(schemaPath, "utf8");

    // schemaオブジェクトを抽出（簡易的な方法）
    const schemaMatch = schemaContent.match(/export const schema = ({[\s\S]*?});/);
    if (!schemaMatch) {
      throw new Error("schemaオブジェクトが見つかりません");
    }

    // スキーマを評価（実際のプロジェクトではより安全な方法を使用）
    const schema = eval(`(${schemaMatch[1]})`);

    // 対象カラムを抽出（重複チェック付き）
    const targetColumns = [];
    const processedColumns = new Set(); // 重複チェック用のSet
    const duplicateInfo = []; // 重複情報を記録

    for (const [tableName, columns] of Object.entries(schema)) {
      for (const [columnName, columnInfo] of Object.entries(columns)) {
        let type = null;

        // 性別関連の判定
        if (isGenderRelated(columnInfo.comment)) {
          type = "gender";
        }
        // 権限関連の判定
        else if (isAuthRelated(columnName, columnInfo.comment)) {
          type = "auth";
        }

        if (type) {
          // カラム名で重複チェック
          if (!processedColumns.has(columnName)) {
            processedColumns.add(columnName);
            targetColumns.push({
              tableName,
              columnName,
              type,
              ...columnInfo,
            });
          } else {
            // 重複情報を記録
            duplicateInfo.push({
              columnName,
              tableName,
              comment: columnInfo.comment,
              type,
            });
            console.log(`⚠️  重複するカラム名をスキップ: ${columnName} (テーブル: ${tableName})`);
          }
        }
      }
    }

    // デフォルト関数を追加（対象カラムがない場合）
    if (targetColumns.length === 0) {
      console.log(`ℹ️  対象カラムが見つかりません。デフォルト関数を追加します。`);
      targetColumns.push(
        {
          columnName: "sex",
          comment: "性別",
          type: "gender",
          tableName: "default",
        },
        {
          columnName: "auth",
          comment: "ユーザー権限",
          type: "auth",
          tableName: "default",
        }
      );
    }

    // 関数を生成
    const functions = targetColumns.map(({ columnName, type, ...columnInfo }) => generateFunction(columnName, columnInfo, type)).join("\n");

    // 関数名のリストを生成
    const functionNames = targetColumns.map(({ columnName }) => generateFunctionName(columnName));

    // useRadioEx.jsのテンプレート
    const useRadioExTemplate = `/**
 * @file useRadioEx.js
 * @description フォーム用ラジオボタンフィールドを簡単に生成するためのカスタムフック
 *
 * このフックは、Material-UIのRadioコンポーネントを使用して、
 * スタイリッシュで機能的なフォームラジオボタンフィールドを提供します。
 * データベーススキーマの性別・権限関連カラムから自動生成されます。
 *
 * @example
 * // 基本的な使用例
 * const [form, formProps] = useFormEx();
 * const { radio_sex, radio_auth } = useRadioEx(form, formProps);
 *
 * // コンポーネント内での使用
 * return (
 *   <form>
 *     {radio_sex({ label: "性別" })}
 *     {radio_auth({ label: "ユーザー権限" })}
 *   </form>
 * );
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @since 2024-12-19
 */

"use client";

import logjs from "@metrojs/logjs";

const log = new logjs("useRadioEx");

/**
 * ラジオボタンフィールドを生成するためのカスタムフック
 * @param {Object} form - フォームデータオブジェクト
 * @param {Object} formProps - フォームプロパティオブジェクト
 * @param {Object} state - 状態オブジェクト
 * @param {Object} actions - アクションオブジェクト
 * @returns {Object} 各種ラジオボタンフィールド生成関数のオブジェクト
 */
const useRadioEx = (form = {}, formProps = {}, state = {}, actions = {}) => {
  const is_standard = false; // 標準のラジオボタンを使用するかどうか
${functions}

  return {
    ${functionNames.join(", ")}
  };
};

export default useRadioEx;`;

    // ファイルサイズをチェック
    // eslint-disable-next-line no-undef
    const fileSizeKB = Math.round(Buffer.byteLength(useRadioExTemplate, "utf8") / 1024);

    console.log(`📝 ファイル生成中... (${fileSizeKB}KB)`);
    fs.writeFileSync(outputPath, useRadioExTemplate, "utf8");

    // ファイル生成完了を待機（CursorのUI更新のため）
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log(`✅ useRadioEx.jsが正常に生成されました`);
    console.log(`📁 出力先: ${outputPath}`);
    console.log(`📊 生成された関数数: ${functionNames.length}`);
    console.log(`🔧 対象カラム数: ${targetColumns.length}`);
    console.log(`🔄 重複チェック: ${processedColumns.size}個のユニークなカラムを処理`);
    console.log(`📏 ファイルサイズ: ${fileSizeKB}KB`);

    // 重複があった場合の詳細情報
    if (duplicateInfo.length > 0) {
      console.log(`ℹ️  重複によりスキップされたカラム: ${duplicateInfo.length}個`);
      duplicateInfo.forEach((dup) => {
        console.log(`   - ${dup.columnName} (${dup.tableName}): ${dup.comment}`);
      });
    }

    // ファイルサイズが大きすぎる場合の警告
    if (fileSizeKB > 500) {
      console.log(`⚠️  ファイルサイズが大きいです (${fileSizeKB}KB)。`);
      console.log(`   エディタのパフォーマンスに影響する可能性があります。`);
    }

    // 生成されたカラムの詳細情報を表示
    console.log(`\n📋 生成されたラジオ関数:`);
    targetColumns.forEach(({ columnName, comment, tableName, type }) => {
      console.log(`   - ${generateFunctionName(columnName)}: ${comment} (${tableName}) [${type}]`);
    });
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

// スクリプト実行
main();
