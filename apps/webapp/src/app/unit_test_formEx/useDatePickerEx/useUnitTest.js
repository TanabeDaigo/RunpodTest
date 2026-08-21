/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - useDatePickerEx Unit Test Hook                          ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   useDatePickerExコンポーネントのテスト用カスタムフック                    ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはuseDatePickerExコンポーネントのテストページで使用される
 * カスタムフックを定義します。フォーム管理、API実行、コピー機能などを提供します。
 *
 * @file useUnitTest.js
 * @module unit_test/useDatePickerEx/useUnitTest
 */

"use client";
//export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { logjs, apijs, hooks } from "@lib/client";

const log = new logjs("unit_test_formEx/useDatePickerEx/useUnitTest");
const api = new apijs("api/test");

/**
 * useDatePickerExのテスト用カスタムフック
 * @param {Object} initState - 初期状態
 * @param {Object} state - アプリケーション状態
 * @param {Object} actions - アクション関数
 * @returns {Array} [form, formProps] フォーム状態とプロパティ
 */
export const useUnitTest = (initState = {}, state, actions) => {
  const router = useRouter();

  const [form, formProps] = hooks.useFormEx(initState);

  const [data, setData] = useState([]);

  /**
   * APIを実行する関数
   */
  const executeApi = async () => {
    const res = await api.post({ mode: "test" });
    log.debug(res);
    setData(res.data);
  };

  /**
   * コピーボタンを生成する関数
   * @param {string} text - コピーするテキスト
   * @returns {JSX.Element} コピーボタンコンポーネント
   */
  const copyButton = (text) => {
    return formProps.iconButton("copy", {
      onClick: () => {
        navigator.clipboard.writeText(text);
        actions.showSnackbar("コードをクリップボードにコピーしました", "success");
      },
    });
  };

  return [
    {
      ...form,
    },
    {
      ...formProps,
      copyButton,
      executeApi,
    },
  ];
};
