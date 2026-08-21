import fs from "fs";
import pg from "pg";

const envText = fs.readFileSync(
  new URL("../../../env/.env.development", import.meta.url),
  "utf8",
);
const env = Object.fromEntries(
  [...envText.matchAll(/^([A-Z0-9_]+)=(.*)$/gm)].map((m) => [m[1], m[2]]),
);

const pool = new pg.Pool({
  host: env.LLM_PG_HOST,
  port: Number(env.LLM_PG_PORT),
  user: env.LLM_PG_USER,
  password: env.LLM_PG_PASSWORD,
  database: env.LLM_PG_DATABASE,
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS product_catalog (
    id BIGSERIAL PRIMARY KEY,
    doc_key TEXT NOT NULL UNIQUE,
    payload JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);
await pool.query(
  "CREATE INDEX IF NOT EXISTS idx_product_catalog_payload ON product_catalog USING GIN (payload)",
);

const seeds = [
  ["apple", { name: "リンゴ", aliases: ["りんご", "林檎", "apple", "Apple"], price_yen: 180, unit: "個" }],
  ["banana", { name: "バナナ", aliases: ["ばなな", "banana", "Banana"], price_yen: 120, unit: "本" }],
  ["mikan", { name: "みかん", aliases: ["ミカン", "蜜柑", "orange"], price_yen: 100, unit: "個" }],
  [
    "apple-juice",
    { name: "りんごジュース", aliases: ["リンゴジュース", "apple juice"], price_yen: 250, unit: "本" },
  ],
  ["premium-apple", { name: "特選リンゴ", aliases: ["プレミアムりんご"], price_yen: 350, unit: "個" }],
];

for (const [k, p] of seeds) {
  await pool.query(
    `INSERT INTO product_catalog (doc_key, payload, updated_at) VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (doc_key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
    [k, JSON.stringify(p)],
  );
}

const all = await pool.query(`
  SELECT id, doc_key, payload->>'name' AS name, payload->'aliases' AS aliases, payload->>'price_yen' AS price
  FROM product_catalog ORDER BY id
`);
console.log("rows:", all.rows.length);
for (const r of all.rows) {
  console.log(`#${r.id} ${r.doc_key} ${r.name} ${JSON.stringify(r.aliases)} ${r.price}`);
}

for (const q of ["林檎", "apple", "りんごジュース", "メロン"]) {
  const r = await pool.query(
    `SELECT payload->>'name' AS name, payload->>'price_yen' AS price
     FROM product_catalog
     WHERE payload->>'name' = $1 OR payload->'aliases' ? $1
     LIMIT 1`,
    [q],
  );
  console.log("lookup", q, "->", r.rows[0] || null);
}

await pool.end();
