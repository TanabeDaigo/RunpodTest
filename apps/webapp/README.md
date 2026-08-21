
## 開発環境構築
```
# nvmインストール
https://qiita.com/akipon0821/items/eaeffe79221cfcd4d258

# NPMインストール
npm install -g npm@11.0.0

# NodeJsインストール
nvm install 22.11.0

# Redisインストール
https://github.com/MicrosoftArchive/redis/releases
Redis-x64-X.X.XXX.msi ダウンロード＆実行

# node_modulesインストール
npm ci
npm install
```

開発サーバー起動

```bash
npm run dev

```

ブラウザで http://localhost:3000 を開いて結果を確認します。

API ルートには http://localhost:3000/api/hello でアクセスできます。

Pages/api ディレクトリは /api/* にマップされます。このディレクトリ内のファイルは、React ページではなく API ルートとして扱われます。

## 設定の法則
<table>
   <tr>
     <td>仕様</td>
     <td>CommonJs</td>
     <td>ECMAScript</td>
   </tr>
   <tr>
    <td>サーバーorブラウザ</td>
    <td>サーバー側</td>
    <td>ブラウザ側</td>
   </tr>
   <tr>
    <td>Jest対応</td>
    <td>対応</td>
    <td>未対応</td>
   </tr>
   <tr>
    <td>packege.jsonの指定</td>
    <td>"type":"commonjs"</td>
    <td>"type":"module"</td>
   </tr>
</table>

## もっと詳しく知る

Next.js について詳しくは、次のリソースをご覧ください。

- [Next.js Documentation](https://nextjs.org/docs) - Next.js の機能と API について学びます。
- [Learn Next.js](https://nextjs.org/learn-pages-router) - インタラクティブな Next.js チュートリアル


## 機能概要

<details>
 <summary>起動時に.nextをクリアする</summary>
 
### .next clear
 
```
１．↓でインストール
npm add rimraf --dev
npm install rimraf

２．↓で削除
npx rimraf .next

３．packege.jsonに↓を追加
"clear": "npm cache verify & npm cache clean --force & npx rimraf .next"

４．npm run build で .nextが作られる、そのあとに npm run clearで消される
```

</details>

<details>
 <summary>Jestについて</summary>

### ポイント
 ・jestは基本的にCommonjs対応になっている。Nodejsがベースなため。
 →Ecmascript用にするために、実行時に↓のコマンドを追加
 cross-env NODE_OPTIONS=--experimental-vm-modules jest
 
 ・__test__フォルダはpages配下に設置しないこと。
 
 ・コンパイル時に__test__フォルダを対象外にするためにtsconfig.build.jsonを追加

 ・.babelrcを設定
   preset-react/ preset-envを追加
   
   ※.babelrc ではなく .babel.config.js を使うこと
     node_modules配下への適用があるのは.babel.config.js
     
     https://qiita.com/toydev/items/e163d35a7e8e3c11fba2

### 構築後確認内容
```
 ・テストモジュールをコンパイルに含めない
 ・画面のテストができること
 ・APIのテストができること
 ・ユーティリティのテストができること
 ・スナップショットテストができること
```

</details>


##ストーリーブック

<details>
 <summary>DIContainerについて</summary>
 
## DIContainerについて
　・tsyringeを採用(軽量、開発元がMicroSoft)
 
```
　１．instrumentation.js 初回起動時にcreateDIContainerでDIコンテナを構築
　　  console.log("DIコンテナ構築");
  　　globalThis.container = await createDIContainer(); //
　２．API実行時にロードして実行する
　　　await globalThis.container.resolve(`Hoge`).exec();

※注意点
injectableするクラスは下記のようにしないといけない

import { injectable } from "tsyringe";
　　　　　　　　　↓★
export default @injectable() class Hoge {

  // コンストラクタ
  constructor() {
    console.log("constructor START!!");
  }

  async exec() {
    console.log("Hoge exec");
  }
}
```

</details>

<details>
 <summary>キャッシュ等クリアする</summary>
 
## npm run clear 
```
packege.json
"scripts": {
  ・・・
  ↓　キャッシュ強制クリアと.nextフォルダ削除
  "clear": "npm cache verify & npm cache clean --force & npx rimraf .next",
　・・・
}
```
## ブラウザ起動
```
packege.json
"scripts": {
  ・・・
  "dev": "npx open-cli http://localhost:3000 && next dev",
  ・・・
}
```
</details>

<details>
 <summary>環境設定　※セキュリティ上 .envに各環境の設定を行う</summary>

## 環境設定　※セキュリティ上 .envに各環境の設定を行う

```
 ・cross-env,dotenvを利用
　・next.config.mjsで読み込みを行う
  ・.env.development  ・・・開発環境
  ・.env.production   ・・・本番環境
  ・.env.staging      ・・・検証環境
　・実際はコミットせずに各環境に設置して行う必要がある。セキュリティ上
  ・.env ファイルは Nextjsを使うので、NEXT_PUBLIC_を先頭に付ける必要がある

※ファイルパスを変更したい場合↓
next.config.mjs

// env ファイルで読み込み
let env_file = `.env.${process.env.ENVIRONMENT}`;　←を変更
console.log(`nextConfig - env_file:${env_file}`); 
let config = dotenv.config({ path: env_file, debug: !true });

```
### 環境の指定は↓
```
packege.json
"scripts": {
  ・・・
　　"dev": "npx open-cli http://localhost:3000 && cross-env ENVIRONMENT=development next dev",　・・・ローカル開発環境
    "build:stg": "cross-env ENVIRONMENT=staging next build", ・・・検証ビルド
    "start:stg": "cross-env ENVIRONMENT=staging next start", ・・・検証起動
    "build": "cross-env ENVIRONMENT=production  next build", ・・・本番ビルド
    "start": "cross-env ENVIRONMENT=production  next start",　・・・本番起動
  ・・・
}
```

</details>


<details>
 <summary>エイリアスの設定</summary>

## エイリアスの設定
next.config.mjs ↓に追加
```
  /** WebPack の設定を追加 */
  webpack: config => {
    // モジュールのパス解決とエイリアスを設定している。
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@config": path.resolve(__dirname, "src/config"),
    }
    return config;
  },

↓のようにImport
import * as utils from "@utils";
import config from "@config";

const log = new utils.logjs("dbjs");
```
</details>

<details>
 <summary>Redis-Sessionについて</summary>
<B>Redis-Session機能</B><br/>
・next-session、redisを利用

１．起動時(instrumentation.js)にてredisにアクセス<br/>
　インスタンスをglobalThis.storeに登録<br/>
　※redisモジュールがCommonJsのため、下記の設定をnext.config.mjsに登録<br/>
```
// ↓Ecmascriptなので、requireを使えるようにする(Redis導入にあたり設定) 
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

  webpack: config => {
  
    ・・・
  
    // redisの導入にあたり、下記を設定(CommonJSで読み込むため)
    config.resolve.fallback = {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify')
    };
  }
```

２．APIアクセス時にnext-sessionから読み取り、requestに登録
```
import nextSession from "next-session";
const getSession = nextSession({ autoCommit: true, store: globalThis.store });

    const session = await getSession(req, res);
    req.session = session;

    req.session.user = { name: 'login'};// セッション登録
    await req.session.commit();// セッションコミット
    await session.destroy(); // セッション破棄
```
</details>

<details>
 <summary>カスタムサーバー(クラスタ構成)とRedisセッションについて</summary>
## カスタムサーバー(クラスタ構成)とRedisセッションについて

server/index.js ・・・ カスタムサーバー<br/>
expressでクラスタ構成を行う<br/>
Redisコネクションを行う<br/>
　
> [!IMPORTANT]
> Nextjsのmiddleware機能でセッション登録できるが、NextResponseを使うとその配下が全てEcmaScript扱いになり、エラーが発生する<br/>
> Redisのコネクションは、Nextjsの初期起動時(instrumentation.js)で出来るが、そのあとにSession登録しないといけないため、利用しないこととする<br/>
> Cookieでセッション管理が必要なため、express-sessionを利用<br/>

カスタムサーバー起動にtsconfig.server.jsonを設置<br/>
開発環境の起動でnodemonを利用<br/>
packege.jsonのscriptsにgulpコマンドを利用できるようにした<br/>

</details>
