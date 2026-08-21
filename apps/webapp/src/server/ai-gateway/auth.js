/**
 * 共通GPU: Auth / Tenant（学習ラボ用の薄い検証）
 */

/**
 * @param {object} params
 * @param {string} [params.tenantId]
 * @param {boolean} [params.requireTenant]
 * @returns {{ ok: true, tenantId: string|null } | { ok: false, error: string }}
 */
export function assertTenant({ tenantId, requireTenant = false } = {}) {
  const id = tenantId != null && String(tenantId).trim() ? String(tenantId).trim() : null;
  if (requireTenant && !id) {
    return { ok: false, error: "tenant_id が必要です" };
  }
  return { ok: true, tenantId: id };
}
