/**
 * @file generate_all_FormEx.js
 * @description 全てのFormExフックを一括生成するスクリプト
 *
 * このスクリプトは、以下のスクリプトを順次実行して、
 * データベーススキーマから各種FormExフックを自動生成します：
 * - generate_InputEx.js
 * - generate_DatePickerEx.js
 * - generate_CheckBoxEx.js
 * - generate_SwitchEx.js
 *
 * 実行例:
 *   node ./scripts/generate_all_FormEx.js
 *   node ./scripts/generate_all_FormEx.js --force
 *   node ./scripts/generate_all_FormEx.js -f
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @since 2024-12-19
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 実行するスクリプトのリスト
const SCRIPTS = [
  {
    name: "generate_FormEx/generate_InputEx.js",
    description: "入力フィールド用フック生成",
    targetTypes: ["varchar", "text", "char", "int", "bigint", "float", "double", "decimal", "mediumint", "smallint"],
  },
  {
    name: "generate_FormEx/generate_DatePickerEx.js",
    description: "日付ピッカー用フック生成",
    targetTypes: ["timestamp", "datetime", "date"],
  },
  {
    name: "generate_FormEx/generate_CheckBoxEx.js",
    description: "チェックボックス用フック生成",
    targetTypes: ["tinyint", "boolean"],
  },
  {
    name: "generate_FormEx/generate_SwitchEx.js",
    description: "スイッチ用フック生成",
    targetTypes: ["boolean", "tinyint"],
  },
  {
    name: "generate_FormEx/generate_RadioEx.js",
    description: "ラジオボタン用フック生成",
    targetTypes: ["tinyint", "boolean"],
  },
];

// ユーザーに確認を求める関数
function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

/**
 * スクリプトを実行する関数
 * @param {string} scriptPath - スクリプトのパス
 * @param {string} scriptName - スクリプト名
 * @param {boolean} force - 強制上書きフラグ
 * @param {string[]} extraArgs - 追加の引数
 * @returns {Promise<boolean>} 実行成功かどうか
 */
const executeScript = (scriptPath, scriptName, force = false, extraArgs = []) => {
  return new Promise((resolve, reject) => {
    console.log(`\n ${scriptName} を実行中...`);
    console.log(` パス: ${scriptPath}`);

    const args = [scriptPath];
    if (force) {
      args.push("--force");
    }
    if (extraArgs.length > 0) {
      args.push(...extraArgs);
    }

    const child = spawn("node", args, {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${scriptName} が正常に完了しました`);
        resolve(true);
      } else {
        console.error(`❌ ${scriptName} でエラーが発生しました (終了コード: ${code})`);
        resolve(false);
      }
    });

    child.on("error", (error) => {
      console.error(`❌ ${scriptName} の実行中にエラーが発生しました:`, error.message);
      resolve(false);
    });
  });
};

/**
 * 生成されたファイルの情報を表示
 */
const showGeneratedFiles = () => {
  const outputDir = path.join(__dirname, "../src/client/hooks/FormEx");

  console.log(`\n 生成されたファイル一覧:`);

  const expectedFiles = ["useInputEx.js", "useDatePickerEx.js", "useCheckBoxEx.js", "useSwitchEx.js", "useRadioEx.js"];

  expectedFiles.forEach((fileName) => {
    const filePath = path.join(outputDir, fileName);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const fileSizeKB = Math.round(stats.size / 1024);
      console.log(`   ✅ ${fileName} (${fileSizeKB}KB)`);
    } else {
      console.log(`   ❌ ${fileName} (生成されませんでした)`);
    }
  });
};

/**
 * 既存ファイルの確認
 */
const checkExistingFiles = () => {
  const outputDir = path.join(__dirname, "../src/client/hooks/FormEx");
  const expectedFiles = ["useInputEx.js", "useDatePickerEx.js", "useCheckBoxEx.js", "useSwitchEx.js", "useRadioEx.js"];
  const existingFiles = [];

  expectedFiles.forEach((fileName) => {
    const filePath = path.join(outputDir, fileName);
    if (fs.existsSync(filePath)) {
      existingFiles.push(fileName);
    }
  });

  return existingFiles;
};

/**
 * メイン処理
 */
const main = async () => {
  try {
    console.log(" FormExフック一括生成スクリプトを開始します");
    console.log("=".repeat(60));

    // 既存ファイルの確認
    const existingFiles = checkExistingFiles();
    let force = false;

    if (existingFiles.length > 0) {
      console.log(`既存ファイルが見つかりました: ${existingFiles.join(", ")}`);
      const answer = await askQuestion("既存ファイルを上書きしますか？ (y/N): ");

      if (answer === "y" || answer === "yes") {
        force = true;
        console.log("既存ファイルを上書きして続行します。");
      } else {
        console.log("処理をキャンセルしました。");
        return;
      }
    }

    const startTime = Date.now();
    let successCount = 0;
    let totalCount = SCRIPTS.length;

    // 各スクリプトを順次実行
    for (const script of SCRIPTS) {
      const scriptPath = path.join(__dirname, script.name);

      // スクリプトファイルの存在確認
      if (!fs.existsSync(scriptPath)) {
        console.error(`❌ スクリプトファイルが見つかりません: ${scriptPath}`);
        continue;
      }

      console.log(`\n📝 ${script.description}`);
      console.log(`🎯 対象データ型: ${script.targetTypes.join(", ")}`);

      // 個別の --schema と --out を付与
      const schemaPath = path.join(__dirname, "../src/server/db/schema/db_schema.js");
      let outFile = null;
      if (script.name === "generate_FormEx/generate_InputEx.js") {
        outFile = path.join(__dirname, "../src/client/hooks/FormEx/useInputEx.js");
      } else if (script.name === "generate_FormEx/generate_DatePickerEx.js") {
        outFile = path.join(__dirname, "../src/client/hooks/FormEx/useDatePickerEx.js");
      } else if (script.name === "generate_FormEx/generate_CheckBoxEx.js") {
        outFile = path.join(__dirname, "../src/client/hooks/FormEx/useCheckBoxEx.js");
      } else if (script.name === "generate_FormEx/generate_SwitchEx.js") {
        outFile = path.join(__dirname, "../src/client/hooks/FormEx/useSwitchEx.js");
      } else if (script.name === "generate_FormEx/generate_RadioEx.js") {
        outFile = path.join(__dirname, "../src/client/hooks/FormEx/useRadioEx.js");
      }

      const extraArgs = ["--schema", schemaPath, "--out", outFile];

      const success = await executeScript(scriptPath, script.name, force, extraArgs);
      if (success) {
        successCount++;
      }
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    // 結果サマリー
    console.log("\n" + "=".repeat(60));
    console.log("📊 実行結果サマリー");
    console.log("=".repeat(60));
    console.log(`⏱️  実行時間: ${duration}秒`);
    console.log(`✅ 成功: ${successCount}/${totalCount} スクリプト`);
    console.log(`❌ 失敗: ${totalCount - successCount}/${totalCount} スクリプト`);

    if (successCount === totalCount) {
      console.log("\n 全てのスクリプトが正常に完了しました！");
    } else {
      console.log(`\n⚠️  ${totalCount - successCount}個のスクリプトでエラーが発生しました`);
    }

    // 生成されたファイルの確認
    showGeneratedFiles();

    // 次のステップの案内
    console.log("\n📚 次のステップ:");
    console.log("   1. 生成されたファイルを確認してください");
    console.log("   2. 必要に応じてカスタマイズしてください");
    console.log("   3. アプリケーションで使用してください");
  } catch (error) {
    console.error("❌ 一括生成スクリプトでエラーが発生しました:", error.message);
    process.exit(1);
  }
};

// スクリプト実行
main();
