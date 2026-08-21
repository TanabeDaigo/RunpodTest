/**
 * カスタムサーバーウォッチャー
 * chokidarを使用してServerフォルダ配下の変更を監視
 */

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { spawn } from "child_process";
import chokidar from "chokidar";
import logjs from "@krono-metro/metrojs/logjs";

const log = new logjs("watch-server");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 監視対象のパス
const serverPath = resolve(__dirname, "../src/server");

// リロードスクリプトのパス
const reloadScript = resolve(__dirname, "./reload-container.js");

let reloadProcess = null;

// リロード処理
function reloadContainer() {
  log.info("Serverファイルが変更されました。コンテナをリロード中...");

  if (reloadProcess) {
    reloadProcess.kill();
  }

  reloadProcess = spawn("node", [reloadScript], {
    stdio: "inherit",
    cwd: resolve(__dirname, ".."),
  });

  reloadProcess.on("error", (err) => {
    log.error("リロードプロセスの起動に失敗しました:", err);
  });

  reloadProcess.on("exit", (code) => {
    if (code !== 0) {
      log.error(`リロードプロセスが終了しました。終了コード: ${code}`);
    }
  });
}

// ウォッチャーの設定
const watcher = chokidar.watch(serverPath, {
  ignored: [/node_modules/, /\.next/, /\.git/, /\.DS_Store/, /\.swp/, /\.swo/, /\.tmp/, /\.log$/, /\.test\.js$/, /\.spec\.js$/],
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,
    pollInterval: 100,
  },
});

// イベントハンドラー
watcher
  .on("add", (path) => {
    log.info(`ファイルが追加されました: ${path}`);
    reloadContainer();
  })
  .on("change", (path) => {
    log.info(`ファイルが変更されました: ${path}`);
    reloadContainer();
  })
  .on("unlink", (path) => {
    log.info(`ファイルが削除されました: ${path}`);
    reloadContainer();
  })
  .on("error", (error) => {
    log.error(`ウォッチャーエラー: ${error}`);
  })
  .on("ready", () => {
    log.info(`Serverフォルダの監視を開始しました: ${serverPath}`);
  });

// シグナルハンドリング
const handleSignal = (signal) => {
  log.info(`${signal} を受信しました。シャットダウン中...`);
  if (reloadProcess) {
    reloadProcess.kill();
  }
  watcher.close();
  process.exit(0);
};

process.on("SIGINT", () => handleSignal("SIGINT"));
process.on("SIGTERM", () => handleSignal("SIGTERM"));

log.info("カスタムサーバーウォッチャーを起動しました");
