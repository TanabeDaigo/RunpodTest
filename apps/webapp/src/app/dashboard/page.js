"use client";

import { useDashboard } from "./useDashboard";
import { useEffect } from "react";
import { logjs, apijs } from "@lib/client";

const log = new logjs("DashBoard");
import { providers } from "@lib/client";
const { useWebAppContext } = providers;

// ページレンダリング
export default function Page() {
  // コンテキストの使用
  const webAppContext = useWebAppContext();
  const { state, actions, params } = webAppContext || {};

  // デバッグ用
  //  log.info("params", params);
  //  log.info("state", state);

  const [form, formProps] = useDashboard();
  // ページタイトルを設定
  useEffect(() => {
    actions.setPageTitle("Dashboard");
  }, [actions]);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">ようこそ、{state?.user?.name}さん</h2>
        <p className="text-gray-600 mb-4">ログインID: {state?.user?.login_id}</p>
        <p className="text-gray-600 mb-4">メールアドレス: {state?.user?.email}</p>
        <p className="text-gray-600 mb-4">ロール: {state?.user?.role}</p>
      </div>
    </div>
  );
}
