/**
 * 共通GPU: Queue / RateLimit（学習ラボはパススルー。本番で差し替え）
 */

/**
 * @template T
 * @param {object} params
 * @param {string|null} [params.tenantId]
 * @param {string} [params.op]
 * @param {() => Promise<T>} params.run
 * @returns {Promise<T>}
 */
export async function withQueue({ tenantId, op, run } = {}) {
  // 将来: 案件別並列数・RPM。現状は即実行。
  void tenantId;
  void op;
  return run();
}
