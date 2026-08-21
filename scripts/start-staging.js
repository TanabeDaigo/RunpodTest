const path = require("path");
const { runCommand } = require("./utils");
const generateDBSchema = require("./generate-db-schema");

async function startStaging() {
  try {
    // DB生成を実行
    await generateDBSchema();

    // その他の起動処理
    // ...
  } catch (error) {
    console.error("起動処理中にエラーが発生しました:", error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合
if (require.main === module) {
  startStaging().catch(console.error);
}

module.exports = startStaging;
