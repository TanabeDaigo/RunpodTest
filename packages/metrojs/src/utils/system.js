/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - System Utilities                                 ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive system utility library that provides       ║
 * ║   system information retrieval, environment variable         ║
 * ║   management, and system-level operations                    ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file system.js
 * @description システムユーティリティライブラリ
 *
 * 主な機能:
 * - 環境変数の管理（取得、設定、削除、キャッシュ）
 * - システム情報の取得（プラットフォーム、CPU、メモリ）
 * - メモリ使用量の監視
 * - 非同期処理の制御（スリープ）
 * - ユニークIDの生成（UUID）
 * - プラットフォーム判定
 *
 * @example
 * import {
 *   getEnv,
 *   getSystemInfo,
 *   getMemoryUsage,
 *   sleep,
 *   uuid
 * } from '@krono-metro/metrojs/utils/system';
 *
 * // 環境変数の取得
 * const apiKey = getEnv('API_KEY', 'default');
 *
 * // システム情報の取得
 * const systemInfo = getSystemInfo();
 * console.log(systemInfo.platform); // "win32"
 *
 * // メモリ使用量の取得
 * const memory = getMemoryUsage();
 * console.log(memory.heapUsed); // 100
 *
 * // 非同期処理の制御
 * await sleep(1000); // 1秒待機
 *
 * // UUIDの生成
 * const id = uuid(); // "550e8400-e29b-41d4-a716-446655440000"
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

import { isNull } from "../utils/util.js";

// 環境変数のキャッシュ
const ENV_CACHE = new Map();

/**
 * 環境変数の値を取得します
 * @param {string} key - 環境変数のキー
 * @param {string} [defaultValue=""] - デフォルト値
 * @returns {string} 環境変数の値
 * @example
 * getEnv("NODE_ENV") // "development"
 * getEnv("NOT_EXIST", "default") // "default"
 */
export function getEnv(key, defaultValue = "") {
  if (isNull(key)) return defaultValue;

  // キャッシュをチェック
  if (ENV_CACHE.has(key)) {
    return ENV_CACHE.get(key);
  }

  const value = process.env[key] || defaultValue;
  ENV_CACHE.set(key, value);
  return value;
}

/**
 * 環境変数の値を設定します
 * @param {string} key - 環境変数のキー
 * @param {string} value - 設定する値
 * @returns {void}
 * @example
 * setEnv("API_KEY", "123456")
 * getEnv("API_KEY") // "123456"
 */
export function setEnv(key, value) {
  if (isNull(key)) return;

  process.env[key] = value;
  ENV_CACHE.set(key, value);
}

/**
 * 環境変数の値を削除します
 * @param {string} key - 環境変数のキー
 * @returns {void}
 * @example
 * setEnv("API_KEY", "123456")
 * deleteEnv("API_KEY")
 * getEnv("API_KEY") // ""
 */
export function deleteEnv(key) {
  if (isNull(key)) return;

  delete process.env[key];
  ENV_CACHE.delete(key);
}

/**
 * 環境変数のキャッシュをクリアします
 * @returns {void}
 * @example
 * setEnv("API_KEY", "123456")
 * clearEnvCache()
 * getEnv("API_KEY") // キャッシュがクリアされる
 */
export function clearEnvCache() {
  ENV_CACHE.clear();
}

/**
 * 指定したミリ秒だけ処理を一時停止します
 * @param {number} ms - 待機時間（ミリ秒）
 * @returns {Promise<void>}
 * @example
 * await sleep(1000) // 1秒待機
 * console.log("1秒後")
 */
export const sleep = async (ms) => {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const elapsed = Date.now() - start;
      if (elapsed >= ms) {
        resolve();
      } else {
        setTimeout(check, Math.max(1, ms - elapsed));
      }
    };
    check();
  });
};

/**
 * UUIDを生成します
 * @returns {string} 生成されたUUID
 * @example
 * const id = uuid()
 * console.log(id) // "550e8400-e29b-41d4-a716-446655440000"
 */
export const uuid = () => {
  return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[x]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return r.toString(16);
  });
};

/**
 * Windows環境かどうかを判定します
 * @returns {boolean} Windows環境の場合はtrue、それ以外はfalse
 * @example
 * if (isWindows()) {
 *   console.log("Windows環境です");
 * }
 */
export const isWindows = () => {
  // ブラウザ環境の場合
  if (typeof navigator !== "undefined") {
    return navigator.platform.includes("Win");
  }

  // Node.js環境の場合
  if (typeof process !== "undefined") {
    // 環境変数から判定
    const os = process.env.OS || process.env.OSTYPE || process.env.PLATFORM;
    return os ? os.toLowerCase().includes("win") : false;
  }

  return false;
};
/**
 * プラットフォーム情報を取得します
 * @returns {string} プラットフォーム名
 */
/*
export const getPlatform = () => {
  if (typeof process === "undefined" || typeof process.platform === "undefined") {
    return "browser";
  }
  return process.platform || "unknown";
};
*/
/**
 * システム情報を取得します
 * @returns {Object} システム情報
 */
/*
export const getSystemInfo = () => {
  // Edge Runtime対応
  if (typeof process === "undefined" || typeof process.platform === "undefined") {
    return {
      platform: "browser",
      arch: "unknown",
      version: "unknown",
      cpus: [],
      memory: { total: 0, free: 0 },
      uptime: 0,
    };
  }

  try {
    return {
      platform: process.platform || "unknown",
      arch: process.arch || "unknown",
      version: process.version || "unknown",
      cpus: process.cpus?.() || [],
      memory: process.memoryUsage?.() || { total: 0, free: 0 },
      uptime: process.uptime?.() || 0,
    };
  } catch (error) {
    console.warn("Failed to get system info:", error);
    return {
      platform: "unknown",
      arch: "unknown",
      version: "unknown",
      cpus: [],
      memory: { total: 0, free: 0 },
      uptime: 0,
    };
  }
};
*/
