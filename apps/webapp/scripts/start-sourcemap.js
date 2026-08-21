/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Sourcemap Build and Start Script                 ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   ソースマップ付きビルドとアプリケーション起動スクリプト     ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import { spawn } from "child_process";
import { resolve } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import logjs from "@krono-metro/metrojs/logjs";
import http from "http";
import fs from "fs";
import path from "path";

const log = new logjs("start-sourcemap");

// ESモジュールでの __filename, __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

try {
  // 環境変数を取得
  const isStaging = process.argv[2] === "staging";
  log.info(`isStaging: ${isStaging}`);

  // プロジェクトのルートディレクトリを取得
  const projectRoot = resolve(__dirname, "../../../");
  log.info(`projectRoot: ${projectRoot}`);

  // 環境変数ファイルのパスを設定
  const envFileName = isStaging ? ".env.staging" : ".env.production";
  const envPath = resolve(projectRoot, "env", envFileName);
  log.info(`envPath: ${envPath}`);

  // 環境変数ファイルの存在確認
  try {
    dotenv.config({ path: envPath });
    log.info("環境変数ファイルを読み込みました");
  } catch (error) {
    log.error(`環境変数ファイルの読み込みに失敗しました: ${envPath}`, error);
    process.exit(1);
  }

  // 環境変数を設定
  const env = {
    ...process.env,
    NODE_ENV: "development",
    NEXT_PUBLIC_NODE_ENV: "development",
    NEXT_SOURCEMAP: "true",
    PORT: process.env.PORT || 3000,
    NEXT_TELEMETRY_DISABLED: "1",
    IS_STAGING: isStaging ? "true" : "false",
    LOG_LEVEL: "info",
    NODE_OPTIONS: "--trace-warnings",
  };

  // 環境変数の確認
  log.info("環境変数の設定:");
  log.info(`NODE_ENV: ${env.NODE_ENV}`);
  log.info(`PORT: ${env.PORT}`);
  log.info(`IS_STAGING: ${env.IS_STAGING}`);
  log.info(`NEXT_SOURCEMAP: ${env.NEXT_SOURCEMAP}`);

  // ビルドプロセスを実行
  log.info("アプリケーションのビルドを開始します...");

  // Next.jsのappディレクトリからルート一覧を動的取得
  function getRoutesFromAppDir() {
    const appDir = resolve(__dirname, "..", "app");
    const routes = [];

    function walk(dir, parentRoute = "") {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walk(fullPath, parentRoute + "/" + file);
        } else if (stat.isFile() && /^page\.(js|jsx|ts|tsx)$/.test(file)) {
          // ルートを生成
          let route = parentRoute || "/";
          // [param]や[...slug]などの動的ルートもそのまま
          route = route.replace(/\/+/g, "/");
          if (!routes.includes(route)) {
            routes.push(route);
          }
        }
      });
    }

    if (fs.existsSync(appDir)) {
      walk(appDir, "");
    }
    return routes;
  }

  // ここでroutesを取得
  const routes = getRoutesFromAppDir();

  // バンドルデータを解析する関数
  function analyzeBundle() {
    const bundlePath = resolve(__dirname, "..", ".next/static/chunks");
    const files = fs.readdirSync(bundlePath);

    const bundleData = {
      totalSize: 0,
      moduleCount: 0,
      pages: {},
      vendor: { size: 0, count: 0, modules: [] },
      node_modules: { size: 0, count: 0, modules: [] },
    };

    // appディレクトリの構造を取得
    const appDir = resolve(__dirname, "..", "app");
    const pageFiles = new Set();

    function collectPageFiles(dir, basePath = "") {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          collectPageFiles(fullPath, path.join(basePath, file));
        } else if (file === "page.tsx" || file === "page.jsx" || file === "page.js" || file === "page.ts") {
          const pagePath = path.join(basePath, file).replace(/\\/g, "/");
          pageFiles.add(pagePath);
        }
      });
    }

    if (fs.existsSync(appDir)) {
      collectPageFiles(appDir);
    }

    // ページごとの初期化
    pageFiles.forEach((pageFile) => {
      const route = "/" + pageFile.replace(/\/page\.(tsx|jsx|js|ts)$/, "");
      bundleData.pages[route] = {
        size: 0,
        count: 0,
        modules: [],
        file: pageFile,
      };
    });

    // チャンクファイルの分析
    files.forEach((file) => {
      if (file.endsWith(".js")) {
        const stats = fs.statSync(resolve(bundlePath, file));
        const size = stats.size / 1024; // KB
        bundleData.totalSize += size;
        bundleData.moduleCount++;

        const moduleInfo = {
          name: file,
          size: size.toFixed(2),
          path: resolve(bundlePath, file),
        };

        // ページチャンクの判定
        let isPageChunk = false;
        for (const [route, pageData] of Object.entries(bundleData.pages)) {
          if (file.includes(route.replace(/\//g, ""))) {
            pageData.size += size;
            pageData.count++;
            pageData.modules.push(moduleInfo);
            isPageChunk = true;
            break;
          }
        }

        // ベンダーモジュールの判定
        if (!isPageChunk) {
          if (file.includes("vendor")) {
            bundleData.vendor.size += size;
            bundleData.vendor.count++;
            bundleData.vendor.modules.push(moduleInfo);
          } else if (file.includes("node_modules")) {
            bundleData.node_modules.size += size;
            bundleData.node_modules.count++;
            bundleData.node_modules.modules.push(moduleInfo);
          }
        }
      }
    });

    return bundleData;
  }

  // 利用可能なポートを検索する関数
  async function findAvailablePort(startPort) {
    const net = require("net");

    return new Promise((resolve, reject) => {
      const server = net.createServer();
      server.unref();

      server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          // ポートが使用中の場合は次のポートを試す
          resolve(findAvailablePort(startPort + 1));
        } else {
          reject(err);
        }
      });

      server.listen(startPort, () => {
        server.close(() => {
          resolve(startPort);
        });
      });
    });
  }

  // サーバー作成関数を修正
  async function createServer(port, bundleData) {
    // 利用可能なポートを検索
    const availablePort = await findAvailablePort(port);

    return new Promise((resolve, reject) => {
      const server = http.createServer((req, res) => {
        if (req.url === "/") {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Bundle Analysis</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .container { display: flex; gap: 20px; }
                  .chart-container { width: 50%; }
                  .details-container { width: 50%; }
                  .summary { margin-bottom: 20px; }
                  .category-section { margin-bottom: 30px; }
                  .category-header {
                    background: #f0f0f0;
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                  }
                  .module-list { max-height: 400px; overflow-y: auto; }
                  .module-item { 
                    padding: 10px;
                    margin: 5px 0;
                    border-radius: 4px;
                    background: #f5f5f5;
                  }
                  .vendor { border-left: 4px solid #ff6b6b; }
                  .app { border-left: 4px solid #4ecdc4; }
                  .node_modules { border-left: 4px solid #45b7d1; }
                  .size-badge {
                    background: #e0e0e0;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 0.9em;
                  }
                  .search-box {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                  }
                  .module-name {
                    font-weight: bold;
                    margin-bottom: 5px;
                  }
                  .module-file {
                    font-family: monospace;
                    font-size: 0.9em;
                    color: #666;
                    margin-bottom: 5px;
                  }
                  .module-details {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  }
                  .module-type {
                    font-size: 0.8em;
                    padding: 2px 6px;
                    border-radius: 3px;
                    background: #e0e0e0;
                  }
                  .vendor .module-type { background: #ff6b6b; color: white; }
                  .app .module-type { background: #4ecdc4; color: white; }
                  .node_modules .module-type { background: #45b7d1; color: white; }
                  .category-summary {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                  }
                  .app-file {
                    font-family: monospace;
                    font-size: 0.9em;
                    color: #666;
                    margin-top: 4px;
                  }
                  .page-section {
                    margin: 20px 0;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                  }
                  .page-header {
                    font-weight: bold;
                    margin-bottom: 10px;
                  }
                  .page-file {
                    font-family: monospace;
                    color: #666;
                    margin-bottom: 10px;
                  }
                </style>
              </head>
              <body>
                <h1>Bundle Analysis</h1>
                <div class="summary">
                  <p>Total Size: ${(bundleData.totalSize / 1024).toFixed(2)} MB</p>
                  <p>Total Modules: ${bundleData.moduleCount}</p>
                </div>

                <div class="details-container">
                  <h2>Pages</h2>
                  ${Object.entries(bundleData.pages)
                    .sort((a, b) => b[1].size - a[1].size)
                    .map(
                      ([route, data]) => `
                      <div class="page-section">
                        <div class="page-header">${route}</div>
                        <div class="page-file">${data.file}</div>
                        <div class="page-summary">
                          Size: ${(data.size / 1024).toFixed(2)} MB
                          Modules: ${data.count}
                        </div>
                        <div class="module-list">
                          ${data.modules
                            .map(
                              (module) => `
                            <div class="module-item">
                              <div class="module-name">${module.name}</div>
                              <div class="module-size">${module.size} KB</div>
                            </div>
                          `
                            )
                            .join("")}
                        </div>
                      </div>
                    `
                    )
                    .join("")}

                  <h2>Vendor Modules</h2>
                  <div class="module-list">
                    ${bundleData.vendor.modules
                      .map(
                        (module) => `
                      <div class="module-item">
                        <div class="module-name">${module.name}</div>
                        <div class="module-size">${module.size} KB</div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>

                  <h2>Node Modules</h2>
                  <div class="module-list">
                    ${bundleData.node_modules.modules
                      .map(
                        (module) => `
                      <div class="module-item">
                        <div class="module-name">${module.name}</div>
                        <div class="module-size">${module.size} KB</div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              </body>
            </html>
          `);
        }
      });

      server.listen(availablePort, () => {
        log.info(`分析サーバーを起動しました（ポート: ${availablePort}）`);
        resolve(server);
      });

      server.on("error", (err) => {
        reject(err);
      });
    });
  }

  // バンドル分析付きでビルドを実行
  const buildProcess = spawn("pnpm", ["next", "build"], {
    stdio: "inherit",
    cwd: resolve(__dirname, ".."),
    env: {
      ...env,
      NODE_ENV: "production",
      NEXT_PUBLIC_NODE_ENV: "production",
      NEXT_SOURCEMAP: "true",
      GENERATE_SOURCEMAP: "true",
      ANALYZE: "true",
    },
    shell: true,
  });

  buildProcess.on("exit", async (code) => {
    if (code !== 0) {
      log.error(`ビルドが失敗しました。終了コード: ${code}`);
      process.exit(code);
    }

    try {
      // バンドルデータを解析
      const bundleData = analyzeBundle();

      // ポート番号を8889に固定
      const port = 8889;

      // サーバーを起動
      const server = await createServer(port, bundleData);
      log.info(`分析サーバーを起動しました（ポート: ${port}`);

      // ブラウザを開く
      log.info("バンドル分析レポートを開きます...");
      const chromeProcess = spawn("cmd", ["/c", "start", "chrome", `http://localhost:${port}`], {
        stdio: "inherit",
        shell: true,
      });

      chromeProcess.on("error", (err) => {
        log.error("Chromeの起動に失敗しました:", err);
      });

      // シグナルハンドリング
      process.on("SIGINT", () => {
        server.close(() => {
          log.info("サーバーを終了しました");
          process.exit(0);
        });
      });
    } catch (error) {
      log.error("サーバーの起動に失敗しました:", error);
      process.exit(1);
    }
  });
} catch (error) {
  log.error("start-sourcemap.js エラー:", error);
  process.exit(1);
}
