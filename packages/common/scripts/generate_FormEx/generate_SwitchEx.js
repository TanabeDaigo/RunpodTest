/**
 * @file generate_SwitchEx.js
 * @description データベーススキーマからuseSwitchEx.jsを自動生成するスクリプト
 *
 * このスクリプトは、db_schema.jsのテーブルカラム情報を参照して、
 * boolean、tinyint型のカラムを抽出し、useSwitchEx.jsを自動生成します。
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

// 対象のデータ型
const TARGET_TYPES = ["boolean", "tinyint"];

/**
 * スイッチ関数名を生成
 * @param {string} columnName - カラム名
 * @returns {string} 関数名
 */
const generateFunctionName = (columnName) => {
  return `switch_${columnName}`;
};

/**
 * スイッチ関数のJSDocコメントを生成
 * @param {string} columnName - カラム名
 * @param {string} comment - コメント
 * @returns {string} JSDocコメント
 */
const generateJSDoc = (columnName, comment) => {
  return `  /**
   * ${comment}スイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ${comment}スイッチのJSX要素
   */`;
};

/**
 * スイッチ関数の実装を生成
 * @param {string} columnName - カラム名
 * @param {Object} columnInfo - カラム情報
 * @returns {string} 関数の実装
 */
const generateFunction = (columnName, columnInfo) => {
  const functionName = generateFunctionName(columnName);
  const jsdoc = generateJSDoc(columnName, columnInfo.comment);

  return `${jsdoc}
  const ${functionName} = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(\`${functionName} form.${columnName}:\${form?.${columnName} || ""} params:\`, params);
    return formProps.toggleSwitch("${columnName}", { label: "${columnInfo.comment}", ...params }, is_debug);
  };`;
};

// コマンドライン引数を解析
function parseArgs() {
  const args = process.argv.slice(2);
  const force = args.includes("--force") || args.includes("-f");

  let schemaPathArg = null;
  let outputPathArg = null;

  // オプション形式
  args.forEach((arg, i) => {
    if (arg === "--schema" && args[i + 1] && !args[i + 1].startsWith("-")) {
      schemaPathArg = args[i + 1];
    }
    if (arg === "--out" && args[i + 1] && !args[i + 1].startsWith("-")) {
      outputPathArg = args[i + 1];
    }
  });

  // 位置引数（オプション以外）
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

    // useSwitchEx.jsの出力パス（引数優先、未指定は従来のデフォルト）
    const outputPath = outputPathArg ? path.resolve(outputPathArg) : path.join(__dirname, "../../src/client/hooks/FormEx/useSwitchEx.js");

    // ファイルがすでに存在するかチェック
    if (fs.existsSync(outputPath) && !force) {
      console.log(`ℹ️  useSwitchEx.jsはすでに存在しています: ${outputPath}`);
      console.log(`   処理をスキップします。`);
      console.log(`   上書きする場合は --force または -f オプションを使用してください。`);
      return;
    }

    if (fs.existsSync(outputPath) && force) {
      console.log(` 既存のuseSwitchEx.jsを上書きします: ${outputPath}`);
    }

    // db_schema.jsを読み込み（引数優先、未指定は従来のデフォルト）
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
        if (TARGET_TYPES.includes(columnInfo.type)) {
          // カラム名で重複チェック
          if (!processedColumns.has(columnName)) {
            processedColumns.add(columnName);
            targetColumns.push({
              tableName,
              columnName,
              ...columnInfo,
            });
          } else {
            // 重複情報を記録
            duplicateInfo.push({
              columnName,
              tableName,
              comment: columnInfo.comment,
            });
            console.log(`⚠️  重複するカラム名をスキップ: ${columnName} (テーブル: ${tableName})`);
          }
        }
      }
    }

    // 関数を生成
    const functions = targetColumns.map(({ columnName, ...columnInfo }) => generateFunction(columnName, columnInfo)).join("\n");

    // 関数名のリストを生成
    const functionNames = targetColumns.map(({ columnName }) => generateFunctionName(columnName));

    // useSwitchEx.jsのテンプレート
    const useSwitchExTemplate = `/**
 * @file useSwitchEx.js
 * @description フォーム用スイッチフィールドを簡単に生成するためのカスタムフック
 *
 * このフックは、Material-UIのSwitchコンポーネントを使用して、
 * スタイリッシュで機能的なフォームスイッチフィールドを提供します。
 * データベーススキーマのboolean、tinyint型カラムから自動生成されます。
 *
 * @example
 * // 基本的な使用例
 * const [form, formProps] = useFormEx();
 * const { switch_status, switch_is_deleted } = useSwitchEx(form, formProps);
 *
 * // コンポーネント内での使用
 * return (
 *   <form>
 *     {switch_status({ label: "ステータス" })}
 *     {switch_is_deleted({ label: "削除済み" })}
 *   </form>
 * );
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @since 2024-12-19
 */

"use client";

import logjs from "@metrojs/logjs";
const log = new logjs("useSwitchEx");

/**
 * スイッチフィールドを生成するためのカスタムフック
 * @param {Object} form - フォームデータオブジェクト
 * @param {Object} formProps - フォームプロパティオブジェクト
 * @returns {Object} 各種スイッチフィールド生成関数のオブジェクト
 */
const useSwitchEx = (form = {}, formProps = {}) => {
${functions}

  return {
    ${functionNames.join(", ")}
  };
};

export default useSwitchEx;`;

    // ファイルサイズをチェック
    // eslint-disable-next-line no-undef
    const fileSizeKB = Math.round(Buffer.byteLength(useSwitchExTemplate, "utf8") / 1024);

    console.log(`ファイル生成中... (${fileSizeKB}KB)`);
    fs.writeFileSync(outputPath, useSwitchExTemplate, "utf8");

    // ファイル生成完了を待機（CursorのUI更新のため）
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log(`✅ useSwitchEx.jsが正常に生成されました`);
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
    console.log(`\n📋 生成されたスイッチ関数:`);
    targetColumns.forEach(({ columnName, comment, tableName }) => {
      console.log(`   - ${generateFunctionName(columnName)}: ${comment} (${tableName})`);
    });
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

// スクリプト実行
main();
