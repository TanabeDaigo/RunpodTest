/**
 * @file generate_server_index.js
 * @description apps/webapp/src/server/index.jsを自動生成するスクリプト
 *
 * このスクリプトは、controllerとlogicフォルダ内のファイルを参照して、
 * index.jsファイルを自動生成します。
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

// 対象ディレクトリ（apps/webapp/scriptsから見た相対パス）
const CONTROLLER_DIR = path.join(__dirname, "../src/server/controller");
const LOGIC_DIR = path.join(__dirname, "../src/server/logic");
// 出力先のファイルパス
const OUTPUT_FILE_PATH = path.join(__dirname, "../src/server/index.js");

/**
 * ファイル一覧を取得
 * @param {string} dirPath - ディレクトリパス
 * @param {string} pattern - ファイル名パターン（例: "Controller.js", "Logic.js"）
 * @returns {Array} ファイル一覧
 */
const getFiles = (dirPath, pattern) => {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  ディレクトリが存在しません: ${dirPath}`);
      return [];
    }

    const files = fs.readdirSync(dirPath);
    return files
      .filter((file) => file.endsWith(pattern))
      .map((file) => file.replace(".js", ""))
      .sort();
  } catch (error) {
    console.error(`❌ ファイル読み込みエラー: ${dirPath}`, error.message);
    return [];
  }
};

/**
 * ファイルを生成する
 * @param {string} filePath - 出力ファイルパス
 * @param {string} content - ファイル内容
 */
const writeFile = (filePath, content) => {
  try {
    // ディレクトリが存在しない場合は作成
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ ファイル生成完了: ${filePath}`);
  } catch (error) {
    console.error(`❌ ファイル生成エラー: ${filePath}`, error.message);
  }
};

/**
 * index.jsファイルを生成
 * @param {Array} controllers - コントローラーファイル一覧
 * @param {Array} logics - ロジックファイル一覧
 * @returns {string} index.jsファイルの内容
 */
const generateIndex = (controllers, logics) => {
  const header = `/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Server Controllers                                ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   サーバーサイドのコントローラーをエクスポートする            ║
 * ║   モジュールエクスポート                                      ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはサーバーサイドのコントローラーをエクスポートします。
 * 各コントローラーはDIコンテナで管理され、必要な機能を提供します。
 *
 * @file index.js
 * @module server/index
 */

`;

  // コントローラーのエクスポート文を生成
  const controllerExports = controllers
    .map((controller) => {
      return `export { default as ${controller} } from "./controller/${controller}";`;
    })
    .join("\n");

  // ロジックのエクスポート文を生成
  const logicExports = logics
    .map((logic) => {
      return `export { default as ${logic} } from "./logic/${logic}";`;
    })
    .join("\n");

  // ファイル内容を組み立て
  let content = header;

  if (controllers.length > 0) {
    content += "// Controllers\n";
    content += controllerExports;
  }

  if (logics.length > 0) {
    if (controllers.length > 0) {
      content += "\n\n";
    }
    content += "// Logics\n";
    content += logicExports;
  }

  return content;
};

/**
 * メイン処理
 */
const main = () => {
  console.log("�� Server Index.js生成を開始します...");

  // コントローラーファイル一覧を取得
  const controllers = getFiles(CONTROLLER_DIR, "Controller.js");
  console.log(`📁 発見されたControllerファイル: ${controllers.length}個`);
  if (controllers.length > 0) {
    console.log(`   ${controllers.join(", ")}`);
  }

  // ロジックファイル一覧を取得
  const logics = getFiles(LOGIC_DIR, "Logic.js");
  console.log(`�� 発見されたLogicファイル: ${logics.length}個`);
  if (logics.length > 0) {
    console.log(`   ${logics.join(", ")}`);
  }

  if (controllers.length === 0 && logics.length === 0) {
    console.log("⚠️  ControllerファイルとLogicファイルが見つかりませんでした");
    return;
  }

  // index.jsファイルを生成
  console.log("\n�� index.jsファイル生成中...");
  const indexContent = generateIndex(controllers, logics);
  writeFile(OUTPUT_FILE_PATH, indexContent);

  console.log("\n�� Server Index.js生成が完了しました！");
  console.log(`�� 出力先: ${OUTPUT_FILE_PATH}`);
  console.log(`📊 統計:`);
  console.log(`   - Controllers: ${controllers.length}個`);
  console.log(`   - Logics: ${logics.length}個`);
};

// スクリプトが直接実行された場合のみメイン処理を実行
//if (import.meta.url === `file://${process.argv[1]}`) {
main();
//}

export { main };
