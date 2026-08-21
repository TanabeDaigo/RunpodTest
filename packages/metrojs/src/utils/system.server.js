/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - System Server Utilities                          ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   Server-side system utility functions that use Node.js APIs  ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

/**
 * システム情報を取得します（サーバーサイド専用）
 * @returns {Object} システム情報
 */
export const getServerSystemInfo = () => {
  if (typeof process === "undefined") {
    return {
      platform: "unknown",
      arch: "unknown",
      version: "unknown",
      cpus: [],
      memory: { total: 0, free: 0 },
      uptime: 0,
    };
  }

  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    cpus: process.cpus(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  };
};

/**
 * メモリ使用量を取得します（サーバーサイド専用）
 * @returns {Object} メモリ使用量情報
 */
export function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    external: Math.round(usage.external / 1024 / 1024),
    rss: Math.round(usage.rss / 1024 / 1024),
  };
}

/**
 * Windows環境かどうかを判定します（サーバーサイド専用）
 * @returns {boolean} Windows環境の場合はtrue、それ以外の場合はfalse
 */
export const isWindows = () => {
  return process.platform === "win32";
};
