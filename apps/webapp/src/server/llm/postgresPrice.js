/**
 * Step13 用: 学習ラボ専用 PostgreSQL 接続（本体の MySQL Sequelize とは別）
 *
 * 正本テーブル: product_catalog
 *   - payload JSONB  … { name, aliases[], price_yen, unit? }
 * 旧テーブル product_prices は参考用に残してよい（本モジュールは使わない）
 */

import pg from "pg";
import logjs from "@metrojs/logjs";

const { Pool } = pg;
const log = new logjs("LlmPostgres");

/** @type {import('pg').Pool | null} */
let pool = null;

const SEED_ROWS = [
  {
    docKey: "apple",
    payload: {
      name: "リンゴ",
      aliases: ["りんご", "林檎", "apple", "Apple"],
      price_yen: 180,
      unit: "個",
    },
  },
  {
    docKey: "banana",
    payload: {
      name: "バナナ",
      aliases: ["ばなな", "banana", "Banana"],
      price_yen: 120,
      unit: "本",
    },
  },
  {
    docKey: "mikan",
    payload: {
      name: "みかん",
      aliases: ["ミカン", "蜜柑", "orange"],
      price_yen: 100,
      unit: "個",
    },
  },
  {
    docKey: "apple-juice",
    payload: {
      name: "りんごジュース",
      aliases: ["リンゴジュース", "apple juice"],
      price_yen: 250,
      unit: "本",
    },
  },
  {
    docKey: "premium-apple",
    payload: {
      name: "特選リンゴ",
      aliases: ["プレミアムりんご"],
      price_yen: 350,
      unit: "個",
    },
  },
];

function getConfig() {
  return {
    host: process.env.LLM_PG_HOST || "127.0.0.1",
    port: Number(process.env.LLM_PG_PORT || 5432),
    user: process.env.LLM_PG_USER || "postgres",
    password: process.env.LLM_PG_PASSWORD || "",
    database: process.env.LLM_PG_DATABASE || "metro_llm",
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

export function getLlmPgPool() {
  if (!pool) {
    const cfg = getConfig();
    if (!cfg.password) {
      log.warn("LLM_PG_PASSWORD が空です。env に設定してください。");
    }
    pool = new Pool(cfg);
    pool.on("error", (err) => {
      log.error("LLM PG pool error", err);
    });
  }
  return pool;
}

export function getLlmPgPublicConfig() {
  const cfg = getConfig();
  return {
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    database: cfg.database,
    passwordSet: Boolean(cfg.password),
  };
}

/**
 * 疎通確認
 */
export async function checkLlmPostgres() {
  const started = Date.now();
  const cfg = getLlmPgPublicConfig();
  const client = await getLlmPgPool().connect();
  try {
    const ping = await client.query("SELECT 1 AS ok, current_database() AS db, current_user AS user");
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    return {
      ok: true,
      ...cfg,
      currentDatabase: ping.rows[0]?.db,
      currentUser: ping.rows[0]?.user,
      tables: tables.rows.map((r) => r.table_name),
      durationMs: Date.now() - started,
    };
  } finally {
    client.release();
  }
}

/**
 * JSONB テーブル作成＋シード（既存 doc_key は上書き）
 */
export async function ensureProductCatalogJsonb({ reseeds = true } = {}) {
  const client = await getLlmPgPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_catalog (
        id          BIGSERIAL PRIMARY KEY,
        doc_key     TEXT NOT NULL UNIQUE,
        payload     JSONB NOT NULL,
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_product_catalog_payload
      ON product_catalog USING GIN (payload)
    `);

    if (reseeds) {
      for (const row of SEED_ROWS) {
        await client.query(
          `
          INSERT INTO product_catalog (doc_key, payload, updated_at)
          VALUES ($1, $2::jsonb, NOW())
          ON CONFLICT (doc_key) DO UPDATE SET
            payload = EXCLUDED.payload,
            updated_at = NOW()
          `,
          [row.docKey, JSON.stringify(row.payload)],
        );
      }
    }

    const count = await client.query("SELECT COUNT(*)::int AS n FROM product_catalog");
    const sample = await listProductPrices();
    return {
      ok: true,
      table: "product_catalog",
      count: count.rows[0].n,
      seeded: reseeds,
      sample,
    };
  } finally {
    client.release();
  }
}

/**
 * 価格一覧（JSONB）
 */
export async function listProductPrices() {
  const result = await getLlmPgPool().query(`
    SELECT id, doc_key, payload, updated_at
    FROM product_catalog
    ORDER BY id
  `);
  return result.rows.map(mapCatalogRow);
}

/**
 * 商品名 / 別名で1件取得
 * 優先: name 完全一致 → aliases 完全一致 → name ILIKE → aliases 要素 ILIKE
 * @param {string} productName
 */
export async function findProductPrice(productName) {
  const name = String(productName || "").trim();
  if (!name) {
    return null;
  }

  const exactName = await getLlmPgPool().query(
    `
    SELECT id, doc_key, payload, updated_at
    FROM product_catalog
    WHERE payload->>'name' = $1
    LIMIT 1
    `,
    [name],
  );
  if (exactName.rows[0]) {
    return mapCatalogRow(exactName.rows[0]);
  }

  const exactAlias = await getLlmPgPool().query(
    `
    SELECT id, doc_key, payload, updated_at
    FROM product_catalog
    WHERE payload->'aliases' ? $1
    LIMIT 1
    `,
    [name],
  );
  if (exactAlias.rows[0]) {
    return mapCatalogRow(exactAlias.rows[0]);
  }

  const fuzzy = await getLlmPgPool().query(
    `
    SELECT id, doc_key, payload, updated_at
    FROM product_catalog
    WHERE payload->>'name' ILIKE $1
       OR EXISTS (
         SELECT 1
         FROM jsonb_array_elements_text(COALESCE(payload->'aliases', '[]'::jsonb)) AS a(alias)
         WHERE a.alias ILIKE $1
       )
    ORDER BY id
    LIMIT 5
    `,
    [`%${name}%`],
  );

  if (fuzzy.rows.length === 1) {
    return mapCatalogRow(fuzzy.rows[0]);
  }
  if (fuzzy.rows.length > 1) {
    return {
      ambiguous: true,
      candidates: fuzzy.rows.map(mapCatalogRow),
    };
  }
  return null;
}

function mapCatalogRow(r) {
  const payload = r.payload || {};
  return {
    id: r.id,
    docKey: r.doc_key,
    productName: payload.name || "",
    aliases: Array.isArray(payload.aliases) ? payload.aliases : [],
    priceYen: payload.price_yen,
    unit: payload.unit || null,
    payload,
    updatedAt: r.updated_at,
    source: "product_catalog.payload(jsonb)",
  };
}

/**
 * 質問文から商品名を推定（正式名＋aliases と突き合わせ）
 * @param {string} query
 * @param {Array<{ productName: string, aliases?: string[] }>} catalog
 */
export function extractProductNameFromQuery(query, catalog = []) {
  const q = String(query || "").trim();
  if (!q) return null;

  /** @type {Array<{ label: string, canonical: string }>} */
  const labels = [];
  for (const item of catalog) {
    const canonical = String(item.productName || "");
    if (canonical) {
      labels.push({ label: canonical, canonical });
    }
    for (const a of item.aliases || []) {
      if (a) {
        labels.push({ label: String(a), canonical });
      }
    }
  }

  labels.sort((a, b) => b.label.length - a.label.length);
  for (const item of labels) {
    if (item.label && q.includes(item.label)) {
      return item.canonical;
    }
  }

  const patterns = [
    /(.+?)の\s*(今の)?\s*価格/,
    /(.+?)は\s*いくら/,
    /(.+?)の\s*値段/,
    /価格[はを]?\s*(.+)/,
  ];
  for (const re of patterns) {
    const m = q.match(re);
    if (m?.[1]) {
      const raw = m[1].replace(/[はをに。？?\s]+$/g, "").trim();
      if (raw && raw.length <= 40) {
        return raw;
      }
    }
  }

  return null;
}

/**
 * DB 行を LLM 用の参考情報テキストに
 * @param {object} row
 */
export function formatPriceContext(row) {
  if (!row) {
    return "（該当する商品の価格データはありません）";
  }
  const updated =
    row.updatedAt instanceof Date
      ? row.updatedAt.toISOString()
      : String(row.updatedAt ?? "");
  const aliases = (row.aliases || []).join(", ") || "（なし）";
  return [
    `[DB: product_catalog / payload JSONB]`,
    `doc_key: ${row.docKey || "-"}`,
    `商品名: ${row.productName}`,
    `別名: ${aliases}`,
    `価格: ${row.priceYen} 円`,
    `単位: ${row.unit || "-"}`,
    `更新日時: ${updated}`,
  ].join("\n");
}
