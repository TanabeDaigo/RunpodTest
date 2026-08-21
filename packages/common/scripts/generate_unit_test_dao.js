/**
 * @file generate_unit_test_dao.js
 * @description unit_test_dao配下のテストページを自動生成するスクリプト
 *
 * このスクリプトは、DAOファイルを参照して、
 * 各DAOのテストページを自動生成します。
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

// DAOファイルのディレクトリ
const DAO_DIR = path.join(__dirname, "../src/server/dao");
// 出力先のベースパス
const OUTPUT_BASE_PATH = path.join(__dirname, "../../../apps/webapp/src/app/unit_test_dao");
// コントローラー出力先のベースパス
const CONTROLLER_OUTPUT_PATH = path.join(__dirname, "../../../apps/webapp/src/server/controller");

/**
 * テンプレートファイルを読み込む
 * @param {string} templateName - テンプレートファイル名
 * @returns {string} テンプレートファイルの内容
 */
const loadTemplate = (templateName) => {
  try {
    const templatePath = path.join(__dirname, "template", "generate_unit_test_dao", templateName);
    return fs.readFileSync(templatePath, "utf8");
  } catch (error) {
    console.error(`❌ テンプレートファイル読み込みエラー: ${templateName}`, error.message);
    throw error;
  }
};

/**
 * DAOファイル一覧を取得
 * @returns {Array} DAOファイル一覧
 */
const getDaoFiles = () => {
  try {
    const files = fs.readdirSync(DAO_DIR);
    return files
      .filter((file) => file.endsWith("Dao.js") && file !== "index.js")
      .map((file) => file.replace(".js", ""))
      .sort();
  } catch (error) {
    console.error("❌ DAOファイル読み込みエラー:", error.message);
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
 * page.jsファイルを生成
 * @returns {string} page.jsファイルの内容
 */
const generatePage = () => {
  return loadTemplate("page.js.template");
};

/**
 * useUnitTestファイルを生成
 * @param {Array} daoList - DAOファイル一覧
 * @returns {string} useUnitTestファイルの内容
 */
const generateUseUnitTest = (daoList) => {
  const template = loadTemplate("useUnitTest.js.template");
  const daoListString = daoList.map((dao) => `"${dao}"`).join(",\n    ");
  return template.replace("{{daoList}}", daoListString);
};

/**
 * styles.jsファイルを生成
 * @returns {string} styles.jsファイルの内容
 */
const generateStyles = () => {
  return loadTemplate("styles.js.template");
};

/**
 * layout.jsファイルを生成
 * @returns {string} layout.jsファイルの内容
 */
const generateLayout = () => {
  return loadTemplate("layout.js.template");
};

/**
 * TestDaoControllerファイルを生成
 * @param {Array} daoList - DAOファイル一覧
 * @returns {string} TestDaoControllerファイルの内容
 */
const generateTestDaoController = (daoList) => {
  const template = loadTemplate("controller.js.template");

  // 各DAOのメソッドを生成
  const daoMethods = daoList
    .map((daoName) => {
      return `  /**
   * ${daoName}のfind関数テスト
   */
  async find_${daoName}(req, dbjs) {
    log.debug("find_${daoName}");
    await this.useModules(["${daoName}"]);
    try {
      const result = await this.${daoName}.find(this.params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }`;
    })
    .join("\n\n");

  return template.replace("{{daoMethods}}", daoMethods);
};

/**
 * メイン処理
 */
const main = () => {
  console.log("🚀 DAO Unit Testページ生成を開始します...");

  // DAOファイル一覧を取得
  const daoList = getDaoFiles();
  console.log(`📁 発見されたDAOファイル: ${daoList.length}個`);
  console.log(`   ${daoList.join(", ")}`);

  if (daoList.length === 0) {
    console.log("⚠️  DAOファイルが見つかりませんでした");
    return;
  }

  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(OUTPUT_BASE_PATH)) {
    fs.mkdirSync(OUTPUT_BASE_PATH, { recursive: true });
  }

  // 各ファイルを生成
  console.log("\n📝 ファイル生成中...");

  // page.jsファイル
  const pagePath = path.join(OUTPUT_BASE_PATH, "page.js");
  writeFile(pagePath, generatePage());

  // useUnitTestファイル
  const useUnitTestPath = path.join(OUTPUT_BASE_PATH, "useUnitTest.js");
  writeFile(useUnitTestPath, generateUseUnitTest(daoList));

  // styles.jsファイル
  const stylesPath = path.join(OUTPUT_BASE_PATH, "styles.js");
  writeFile(stylesPath, generateStyles());

  // layout.jsファイル
  const layoutPath = path.join(OUTPUT_BASE_PATH, "layout.js");
  writeFile(layoutPath, generateLayout());

  // TestDaoControllerファイル
  console.log("\n🎮 TestDaoController生成中...");
  const controllerPath = path.join(CONTROLLER_OUTPUT_PATH, "TestDaoController.js");
  writeFile(controllerPath, generateTestDaoController(daoList));

  console.log("\n🎉 DAO Unit Testページ生成が完了しました！");
  console.log(`📂 フロントエンド出力先: ${OUTPUT_BASE_PATH}`);
  console.log(`📂 コントローラー出力先: ${CONTROLLER_OUTPUT_PATH}`);
};

// スクリプトが直接実行された場合のみメイン処理を実行
//if (import.meta.url === `file://${process.argv[1]}`) {
main();
//}

export { main };
