/**
 * ⚡️ KronoMetro
 *
 * エレガントで効率的なクライアントサイドユーティリティ
 *
 * Copyright © 2024-present KronoMetro, Co. All rights reserved.
 *
 * @module client
 * @description クライアントサイドで使用する主要なモジュールをエクスポートします
 *
 * @exports {Object} logjs - 洗練されたロギングユーティリティ
 * @exports {Object} utils - 汎用的なヘルパー関数群
 * @exports {Object} apijs - APIリクエストユーティリティ
 * @exports {Object} components - 共通UIコンポーネント
 * @exports {Object} providers - コンテキストプロバイダー
 * @exports {Object} hooks - カスタムReactフック
 */

"use client";

import { components as metroComponents, apijs } from "@metrojs/client";
import { hooks, components as commonComponents, utils, providers } from "@common/client";
import { Consts, config } from "@common/config";
import logjs from "@metrojs/logjs";
import dayjs from "@metrojs/dayjs";

const components = {
  ...commonComponents,
  ...metroComponents,
};

// すべてのエクスポートを追加
export { utils, components, providers, hooks, Consts, config, dayjs, logjs, apijs };
