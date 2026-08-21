/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Client Module Index                               ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   The main entry point for MetroJS client-side modules,       ║
 * ║   providing access to hooks, API utilities, and components    ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file index.js
 * @description MetroJSクライアントサイドモジュールのメインエントリーポイント
 *
 * 以下のモジュールを提供:
 * - hooks: カスタムReactフック（フォーム管理、バリデーション、レスポンシブ対応など）
 * - apijs: API通信ユーティリティ
 * - components: UIコンポーネントライブラリ
 *
 * @example
 * // モジュールのインポート
 * import { hooks, apijs, components } from '@krono-metro/metrojs/client';
 *
 * // フックの使用
 * const { useForm, useValidation } = hooks;
 * const [form, { input, button }] = useForm(initialValues);
 *
 * // APIの使用
 * const { get, post } = apijs;
 * const data = await get('/api/users');
 *
 * // コンポーネントの使用
 * const { Button, Input } = components;
 * <Button variant="contained">Click me</Button>
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";

/**
 * カスタムフックモジュール
 * @type {Object}
 */
import hooks from "./hooks/index.js";

/**
 * API通信ユーティリティモジュール
 * @type {Object}
 */
import apijs from "../lib/apijs.js";

import libs from "./libs/index.js";
/**
 * UIコンポーネントライブラリ
 * @type {Object}
 */
import components from "./components/index.js";

// モジュールのエクスポート
export { hooks, apijs, components, libs };
