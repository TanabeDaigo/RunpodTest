/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Clean Script                                     ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   ビルド成果物を削除するスクリプト                           ║
 * ║   クリーンアップモジュール                                    ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはビルド成果物やキャッシュを削除します。
 * 主な機能：
 * - ビルド成果物の削除
 * - キャッシュの削除
 * - 一時ファイルの削除
 *
 * @file clean.js
 * @module scripts/clean
 */

import clean from "@krono-metro/metrojs/clean";

/**
 * コマンドライン引数から削除対象フォルダを取得
 * 引数が指定されていない場合は、デフォルトで.nextとdistを削除
 */
const targetDirs = process.argv.slice(2);
if (targetDirs.length === 0) {
  targetDirs.push(".next", "dist", ".turbo", ".turbo-build");
}

/**
 * 指定されたフォルダを削除
 * @param {string[]} targetDirs - 削除対象のフォルダパスの配列
 */
clean(targetDirs, { appDir: "webapp", packagesDir: "metrojs" });
