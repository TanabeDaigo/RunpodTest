// processモジュールの代わりに、環境変数に直接アクセス
// import process from "process"; // この行を削除
/**
 *
 * KronoMetro
 *
 * Copyright © 2019-present KronoMetro, Co. All rights reserved.
 *
 * 注意：env ファイルで読み込みは使わないこと
 *
 */

/**
 * 環境変数の追加方法:
 * 1. turbo.jsonのglobalEnvに新しい環境変数名を追加
 * 2. env/.env.* の各環境設定ファイルに環境変数を追加
 * 3. 以下のprocess.envから取得する変数リストに追加
 */
const config = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  sequelize: {
    database: process.env.DATABASE,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    config: {
      dialect: process.env.DB_DIALECT,
      host: process.env.DB_HOST,
      pool: {
        // 接続プール構成を後処理する
        max: 20, // プール内の最大接続数を増加（10 → 20）
        min: 2, // プール内の最小接続数を増加（0 → 2）
        acquire: 60000, // 接続取得タイムアウトを延長（30000 → 60000: 30秒 → 60秒）
        idle: 30000, // アイドルタイムアウトを延長（20000 → 30000: 20秒 → 30秒）
        evict: 60000, // 接続の強制削除間隔を設定（60秒）
      },
      dialectOptions: {
        insecureAuth: false, // 安全でない認証を許可する
        // 接続タイムアウトの追加設定
        connectTimeout: 60000, // 接続タイムアウト（60秒）
        dateStrings: true, // 日付をdatetime型ではなく文字列で返す
        typeCast: true, // 型変換を有効にする
      },
      insecureAuth: false, // 安全でない認証を許可する
      timezone: "+09:00", // タイムゾーンを日本時間に設定
      /* logging: false*/
      //クエリのモデル定義がない場合は、これをtrueに設定します。
      //raw: true,
    },
  },
  // セッション関連の設定
  SESSION_MAX_AGE: process.env.SESSION_MAX_AGE || 7200, // 2時間
  SESSION_TOKEN_NAME: process.env.SESSION_TOKEN_NAME || "kronometro_session_token",
  CALLBACK_URL_NAME: process.env.CALLBACK_URL_NAME || "kronometro_callback_url",
  CSRF_TOKEN_NAME: process.env.CSRF_TOKEN_NAME || "kronometro_csrf_token",

  // Ollama（ローカル LLM）
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
    model: process.env.OLLAMA_MODEL || "llama3:8b",
    embedModel: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
    timeoutMs: Number(process.env.OLLAMA_TIMEOUT_MS || 180000),
  },

  // Qdrant（Vector DB）
  qdrant: {
    url: process.env.QDRANT_URL || "http://127.0.0.1:6333",
    collection: process.env.QDRANT_COLLECTION || "metrojs_rag_docs",
    vectorSize: Number(process.env.QDRANT_VECTOR_SIZE || 768),
    timeoutMs: Number(process.env.QDRANT_TIMEOUT_MS || 30000),
  },

  // LLM 学習ラボ専用 PostgreSQL（本体 MySQL とは別接続）
  llmPostgres: {
    host: process.env.LLM_PG_HOST || "127.0.0.1",
    port: Number(process.env.LLM_PG_PORT || 5432),
    user: process.env.LLM_PG_USER || "postgres",
    password: process.env.LLM_PG_PASSWORD || "",
    database: process.env.LLM_PG_DATABASE || "metro_llm",
  },

  // Tavily（Web 検索 / 最新情報ルート学習用）
  tavily: {
    apiKey: process.env.TAVILY_API_KEY || "",
    searchDepth: process.env.TAVILY_SEARCH_DEPTH || "basic",
    maxResults: Number(process.env.TAVILY_MAX_RESULTS || 5),
  },

  // Gemini（通常 LLM / Google Search grounding）
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_LLM_MODEL || process.env.GEMINI_MODEL || "gemini-flash-latest",
    llmModel: process.env.GEMINI_LLM_MODEL || process.env.GEMINI_MODEL || "gemini-flash-latest",
    searchModel: process.env.GEMINI_SEARCH_MODEL || "gemini-flash-latest",
  },

  // 共通GPU AI Gateway（空なら in-process。RUNPOD_* があれば RunPod 優先）
  aiGateway: {
    baseUrl: process.env.AI_GATEWAY_BASE_URL || "",
    apiKey: process.env.AI_GATEWAY_API_KEY || "",
  },
  runpod: {
    apiKey: process.env.RUNPOD_API_KEY || "",
    endpointId: process.env.RUNPOD_ENDPOINT_ID || "",
    apiBase: process.env.RUNPOD_API_BASE || "https://api.runpod.ai/v2",
  },

  // ASES・ASQS・S3の設定
  amazon: {
    Metrojs: {
      region_code: process.env.ASES_REGION_CODE,
      cred_key: process.env.ASES_CREDENTIAL_ACCESS_KEY,
      secret_key: process.env.ASES_CREDENTIAL_SECRET_KEY,
      S3_cred_key: process.env.ASES_CREDENTIAL_ACCESS_KEY,
      S3_secret_key: process.env.ASES_CREDENTIAL_SECRET_KEY,
      from_address: process.env.ASES_FROM_ADDRESS,
      queue_url: process.env.SQS_QUEUE_URL,
      bucket_name: process.env.S3_BUCKET_NAME,
      expires: 60 * 5 , // 5分間
      timeout: 10000 , // 10秒
    },
    // 追加ユーザがある場合はここに追加
  },
};
/**
 * アプリケーション別の設定を取得
 * @param {string} key - 設定キー
 * @returns {any} 設定値
 */
const getAppConfig = key => {
  const appName = config.APP_NAME;
  const appConfig = config.app[appName];

  console.log(`getAppConfig appName:${appName} key:${key}`);
  console.dir({ appName, key, appConfig }, { depth: null }); // thisの代わりに具体的なオブジェクトを指定
  if (appConfig && appConfig[key] !== undefined) {
    return appConfig[key];
  }

  // アプリケーション固有の設定がない場合はグローバル設定を返す
  return config[key];
};
// 設定オブジェクトに動的取得関数を追加
config.getAppConfig = getAppConfig;

export default config;
