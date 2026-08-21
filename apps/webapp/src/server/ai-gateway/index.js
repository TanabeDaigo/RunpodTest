/**
 * 共通GPU AI Gateway（学習ラボ内モジュール）
 *
 * 公開 API（概念）:
 *   POST /v1/hello | /v1/route | /v1/embed | /v1/generate | /v1/web
 *
 * 現状は同一プロセス内でサービス関数を呼ぶ。
 * 本番ではこのパッケージを GPU サーバへ切り出す。
 */

import { errEnvelope } from "./response.js";
import { helloService } from "./services/hello.js";
import { routeService } from "./services/route.js";
import { embedService } from "./services/embed.js";
import { generateService } from "./services/generate.js";
import { webService } from "./services/web.js";

export { assertTenant } from "./auth.js";
export { withQueue } from "./queue.js";
export { okEnvelope, errEnvelope, ensureRequestId } from "./response.js";
export { createOllamaAdapter } from "./adapters/ollama.js";
export { helloService } from "./services/hello.js";
export { routeService } from "./services/route.js";
export { embedService } from "./services/embed.js";
export { generateService } from "./services/generate.js";
export { webService } from "./services/web.js";

/**
 * @param {"hello"|"route"|"embed"|"generate"|"web"} op
 * @param {object} params
 */
export async function dispatchAiGateway(op, params = {}) {
  switch (op) {
    case "hello":
      return helloService(params);
    case "route":
      return routeService(params);
    case "embed":
      return embedService(params);
    case "generate":
      return generateService(params);
    case "web":
      return webService(params);
    default:
      return errEnvelope({
        error: `unknown op: ${op}`,
        requestId: params.requestId,
      });
  }
}
