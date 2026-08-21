/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Build Cleanup Utility                            ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A utility script for cleaning build artifacts and          ║
 * ║   temporary files from the project directory                  ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file clean.js
 * @description ビルド成果物や一時ファイルを削除するユーティリティスクリプト
 *
 * 主な機能:
 * - 指定されたディレクトリの再帰的な削除
 * - コマンドライン引数による対象ディレクトリの指定
 * - エラーハンドリングとログ出力
 * - デフォルトの削除対象（dist）のサポート
 *
 * @example
 * // コマンドラインからの実行
 * node clean.js dist build
 *
 * // モジュールとしての使用
 * import clean from './clean.js';
 * clean(['dist', 'build']);
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

import { rmSync, existsSync, statSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import process from "process";
import logjs from "@krono-metro/metrojs/logjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// 実行場所に応じてルートパスを設定
function getRootDir(appDir = "webapp", packagesDir = "metrojs") {
  // 現在の実行パスを取得
  const currentPath = process.cwd();

  // パス区切り文字を統一（Windows対応）
  const normalizedPath = currentPath.replace(/\\/g, "/");

  // プロジェクトのルートディレクトリを特定
  // apps/{appDir} または packages/{packagesDir} が含まれている場合
  const appPath = `apps/${appDir}`;
  const packagesPath = `packages/${packagesDir}`;
  if (normalizedPath.includes(appPath) || normalizedPath.includes(packagesPath)) {
    // 最初のディレクトリ（apps または packages）の位置を特定
    const rootIndex = normalizedPath.indexOf("apps") !== -1 ? normalizedPath.indexOf("apps") : normalizedPath.indexOf("packages");
    return currentPath.substring(0, rootIndex);
  }

  // デフォルトの相対パス（packages/metrojs/src/scripts からの場合）
  return join(__dirname, "../../../../");
}

/**
 * 指定されたディレクトリを削除する関数
 * @param {string[]} [targetDirs=["dist"]] - 削除対象のディレクトリ名の配列
 * @param {Object} [options={}] - オプションオブジェクト
 * @param {string} [options.appDir="webapp"] - apps配下のアプリケーションディレクトリ名
 * @param {string} [options.packagesDir="metrojs"] - packages配下のパッケージディレクトリ名
 * @description 指定されたディレクトリを再帰的に削除し、ログを出力します
 * @example
 * // 単一のディレクトリを削除
 * clean(['dist']);
 *
 * // 複数のディレクトリを削除
 * clean(['dist', 'build', 'coverage']);
 *
 * // オプションを指定して削除
 * clean(['dist'], { appDir: 'webapp', packagesDir: 'metrojs' });
 */
function clean(targetDirs = ["dist", ".turbo", ".turbo-build"], options = {}) {
  const logger = new logjs("clean");

  // オプションから値を取得（デフォルト値付き）
  const { appDir = "webapp", packagesDir = "metrojs" } = options;

  // ルートディレクトリを取得
  const rootDir = getRootDir(appDir, packagesDir);

  // クリーンアップ対象のパスを定義
  const pathsToClean = targetDirs
    .map((dir) => {
      // 各ディレクトリに対して、apps/{appDir}とpackages/{packagesDir}の両方のパスを生成
      return [
        join(rootDir, "apps", appDir, dir),
        join(rootDir, "packages", packagesDir, dir),
        // ルートディレクトリの.turboと.turbo-buildも追加
        ...(dir === ".turbo" || dir === ".turbo-build" ? [join(rootDir, dir)] : []),
      ];
    })
    .flat();

  // クリーンアップ前のスタイリッシュなログ出力
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("                                                               ");
  console.log("   クリーンアップを開始します                            ");
  console.log("   対象ディレクトリをクリアします...                             ");
  console.log("                                                               ");
  console.log("═══════════════════════════════════════════════════════════════");

  logger.info(`apps/${appDir}/scripts/clean.js`);
  console.log(`Cleaning directories in ${rootDir}`);

  for (const path of pathsToClean) {
    try {
      // ディレクトリが存在するかチェック
      if (!existsSync(path)) {
        logger.info(`Directory does not exist: ${path.replace(rootDir, "")}`);
        continue;
      }

      // より堅牢な削除処理
      rmSync(path, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 200,
        // Windowsでの権限問題に対処
        windowsRetryTimeout: 2000,
        windowsRetryDelay: 200,
      });
      console.log(`Successfully cleaned ${path.replace(rootDir, "")}`);
    } catch (error) {
      // ディレクトリが存在しない場合は無視
      if (error.code === "ENOENT") {
        logger.info(`Directory does not exist: ${path.replace(rootDir, "")}`);
        continue;
      }
      // Windowsでの権限エラーの場合は特別な処理
      if (error.code === "EPERM") {
        logger.warn(`Permission error while cleaning ${path.replace(rootDir, "")}, skipping...`);
        continue;
      }
      // ENOTEMPTYエラーの場合は警告として処理し、プロセスを継続
      if (error.code === "ENOTEMPTY") {
        logger.warn(`Directory not empty, could not clean ${path.replace(rootDir, "")}, skipping...`);
        continue;
      }
      // その他のエラーは致命的として処理
      logger.error(`Error cleaning ${path}:`, error);
      process.exit(1);
    }
  }
}

// コマンドラインから実行された場合
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  clean();
}

export default clean;
