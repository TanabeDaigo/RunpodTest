/**
 *
 * KronoMetro
 *
 * Copyright © 2019-present KronoMetro, Co. All rights reserved.
 *
 * 注意：SRC配下のモジュールは使わないこと
 *
 */

const express = require("express");
const session = require("express-session"); // CookieにセッションIDをもたせるため
const next = require("next");
const cluster = require("cluster");
const os = require("os");

// env ファイルで読み込み
const dotenv = require("dotenv");
let env_file = `env/.env.${process.env.ENVIRONMENT}`;
let env_config = dotenv.config({ path: env_file, debug: !true }).parsed;

const numCPUs = 1; //os.cpus().length;
const dev = process.env.NODE_ENV !== "production";

// サーバー設定
const app = next({ dev, turbo: false }); //turbo:true だと エラーになるため、常にfalse
const handle = app.getRequestHandler();

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // フォークワーカー
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // ワーカーが終了した場合、新しいワーカーをフォーク
  });
} else {
  app.prepare().then(() => {
    const server = express();

    // セッション設定
    server.use(
      session({
        name: "sess",
        secret: process.env.SESSION_SECRET || "secretKey",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          sameSite: "strict",
          maxAge: 3600000, // 1時間
        },
      })
    );

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(env_config.NEXT_PUBLIC_PORT, (err) => {
      if (err) throw err;
      console.log(`Worker ${process.pid} started`);
    });
  });
}
