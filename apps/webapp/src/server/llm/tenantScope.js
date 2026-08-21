/**
 * Step18: マルチテナント境界（tenant_id）
 * - payload: 共有 collection + payload.tenant_id フィルタ
 * - collection: tenant 専用 collection 名 + payload にも tenant_id（二重防御）
 */

export const TENANT_PAYLOAD_KEY = "tenant_id";

export const ISOLATION_MODES = ["payload", "collection"];

/**
 * @param {unknown} raw
 * @returns {string}
 */
export function normalizeTenantId(raw) {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 64);
}

/**
 * @param {unknown} raw
 * @returns {"payload"|"collection"}
 */
export function normalizeIsolationMode(raw) {
  const m = String(raw || "payload")
    .trim()
    .toLowerCase();
  return m === "collection" ? "collection" : "payload";
}

/**
 * @param {string} tenantId - 正規化済み
 * @returns {string}
 */
export function collectionNameForTenant(tenantId) {
  const id = normalizeTenantId(tenantId);
  if (!id) {
    throw new Error("tenantId is required for collection isolation");
  }
  return `t_${id}_docs`;
}

/**
 * @param {object} params
 * @param {string} [params.tenantId]
 * @param {string} [params.collection] - 明示指定（優先）
 * @param {"payload"|"collection"|string} [params.isolationMode]
 * @param {string} [params.defaultCollection]
 * @param {boolean} [params.requireTenant]
 * @returns {{
 *   ok: boolean,
 *   error?: string,
 *   tenantId: string|null,
 *   isolationMode: "payload"|"collection",
 *   collection: string|null,
 *   useTenantFilter: boolean,
 * }}
 */
export function resolveTenantScope({
  tenantId,
  collection,
  isolationMode = "payload",
  defaultCollection = null,
  requireTenant = false,
} = {}) {
  const mode = normalizeIsolationMode(isolationMode);
  const tid = normalizeTenantId(tenantId);
  const explicit = collection && String(collection).trim() ? String(collection).trim() : null;

  if (requireTenant && !tid) {
    return {
      ok: false,
      error: "tenantId が必要です（マルチテナント境界）",
      tenantId: null,
      isolationMode: mode,
      collection: explicit,
      useTenantFilter: false,
    };
  }

  if (!tid) {
    return {
      ok: true,
      tenantId: null,
      isolationMode: mode,
      collection: explicit,
      useTenantFilter: false,
    };
  }

  let resolvedCollection = explicit;
  if (!resolvedCollection) {
    if (mode === "collection") {
      resolvedCollection = collectionNameForTenant(tid);
    } else {
      resolvedCollection = defaultCollection || null;
    }
  }

  return {
    ok: true,
    tenantId: tid,
    isolationMode: mode,
    collection: resolvedCollection,
    // payload / collection どちらでも payload.tenant_id を filter に使う（二重防御）
    useTenantFilter: true,
  };
}

/**
 * Qdrant filter.must 条件を組み立てる
 * @param {object} params
 * @param {string|null} [params.tenantId]
 * @param {string|null} [params.source]
 * @param {boolean} [params.useTenantFilter]
 * @returns {object|undefined}
 */
export function buildQdrantFilter({ tenantId, source, useTenantFilter = true } = {}) {
  const must = [];

  if (useTenantFilter && tenantId) {
    must.push({
      key: TENANT_PAYLOAD_KEY,
      match: { value: String(tenantId) },
    });
  }

  if (source && String(source).trim()) {
    must.push({
      key: "source",
      match: { value: String(source).trim() },
    });
  }

  if (must.length === 0) return undefined;
  return { must };
}

/**
 * Point payload に tenant_id を付与
 * @param {object} payload
 * @param {string|null} tenantId
 */
export function withTenantPayload(payload = {}, tenantId = null) {
  const next = { ...payload };
  if (tenantId) {
    next[TENANT_PAYLOAD_KEY] = tenantId;
  }
  return next;
}
