/**
 * クライアントサイドで使用するモジュールをエクスポートするメインファイル
 *
 * @module client
 * @exports {Object} hooks - フックス関連のモジュール群
 * @exports {Object} components - コンポーネント関連のモジュール群
 * @exports {Object} providers - プロバイダー関連のモジュール群
 * @exports {Object} utils - ユーティリティ関数群
 */

import WebAppProvider, { useWebAppContext } from "./providers/WebAppProvider.js";
import * as commonUtils from "../utils/index.js";
import metroUtils from "@metrojs/utils";
import * as hooks from "./hooks";
import * as components from "./components";

// ユーティリティ関数のマージ
/** @type {Record<string, any>} */
const utils = {
  // 共通ユーティリティ
  ...commonUtils,
  // MetroJSユーティリティ（共通ユーティリティを上書き）
  ...metroUtils,
};

// ローカルのモジュールをエクスポート
export const providers = {
  WebAppProvider,
  useWebAppContext,
};

export { utils, hooks, components };

// 注意: apijs, logjs は @metrojs から直接インポートしてください
