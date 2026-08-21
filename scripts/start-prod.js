const { execSync } = require("child_process");
const path = require("path");

// エラーハンドリング用の関数
const runCommand = (command, errorMessage) => {
  try {
    console.log(`実行中: ${command}`);
    execSync(command, {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: "development",
      },
    });
  } catch (error) {
    console.error(`エラー: ${errorMessage}`);
    console.error(error);
    process.exit(1);
  }
};

// メイン処理
try {
  // 1. DB生成
  console.log("DB生成を開始します...");
  const commonPath = path.join(process.cwd(), "packages", "common");

  // 現在のディレクトリを保存
  const originalDir = process.cwd();

  try {
    // ディレクトリを変更
    process.chdir(commonPath);
    console.log(`現在のディレクトリ: ${process.cwd()}`);

    // DB生成スクリプトの実行
    runCommand("node -r dotenv/config ./scripts/generate_db.js dotenv_config_path=../../env/.env.development", "DB生成中にエラーが発生しました");
  } finally {
    // 元のディレクトリに戻る
    process.chdir(originalDir);
    console.log(`元のディレクトリに戻りました: ${process.cwd()}`);
  }

  // 2. ビルド
  //console.log("ビルドを開始します...");
  //runCommand("turbo run build --concurrency=8", "ビルド中にエラーが発生しました");

  // 3. アプリケーション起動
  //console.log("アプリケーションを起動します...");
  //runCommand("pnpm --filter webapp start", "アプリケーション起動中にエラーが発生しました");
} catch (error) {
  console.error("予期せぬエラーが発生しました:", error);
  process.exit(1);
}
