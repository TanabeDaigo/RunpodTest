# @krono-metro/metrojs

MetroJSは、Next.jsアプリケーションのためのユーティリティライブラリです。

## インストール

```bash
npm install @krono-metro/metrojs
# または
yarn add @krono-metro/metrojs
```

## 使用方法

### クライアントサイド

```javascript
import { logjs, apijs, hooks } from "@krono-metro/metrojs/client";

// ロガーの使用
const log = new logjs("MyComponent");
log.debug("デバッグメッセージ");
log.info("情報メッセージ");
log.warn("警告メッセージ");
log.error("エラーメッセージ");

// APIクライアントの使用
const api = new apijs("api/endpoint");
const result = await api.post({ data: "value" });

// フックの使用
const [form, formProps] = hooks.useFormEx({ initialValue: "default" });
```

### サーバーサイド

```javascript
import { logjs, dbjs } from "@krono-metro/metrojs/server";

// ロガーの使用
const log = new logjs("MyServer");
log.debug("デバッグメッセージ");

// データベース接続の使用
const db = new dbjs(Sequelize, config);
await db.connect();
const result = await db.select("SELECT * FROM table");
```

### 共通ユーティリティ

```javascript
import { logjs, util } from "@krono-metro/metrojs/common";

// ロガーの使用
const log = new logjs("MyModule");

// ユーティリティ関数の使用
const isNull = util.isNull(value);
const length = util.lengthForJson(jsonObject);
```

## ライセンス

MIT
