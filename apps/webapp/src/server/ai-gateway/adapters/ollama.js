/**
 * Ollama Adapter 工場（共通GPU側）
 */
import { service } from "@lib/server";

const { OllamaService } = service;

/**
 * @param {object} [opts]
 * @param {string} [opts.baseUrl]
 * @param {string} [opts.model]
 * @param {string} [opts.embedModel]
 */
export function createOllamaAdapter(opts = {}) {
  return new OllamaService({
    baseUrl: opts.baseUrl,
    model: opts.model,
    embedModel: opts.embedModel,
  });
}
