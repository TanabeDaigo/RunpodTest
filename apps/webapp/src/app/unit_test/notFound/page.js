"use client";

import { notFound } from "next/navigation";
import { providers } from "@lib/client";
const { useWebAppContext } = providers;

/**
 * Not Foundページのテスト用コンポーネント
 * @returns {JSX.Element} テスト用のNot Foundページ
 */
export default function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};

  const handleNotFound = () => {
    try {
      console.log("Not Foundを発生させます");
      throw new Error("ページが見つかりません");
    } catch (error) {
      console.error("Not Foundが発生しました:", error);
      // Not Foundページを表示
      notFound();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Not Foundページテスト</h1>
      <button onClick={handleNotFound} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
        Not Foundを発生させる
      </button>
    </div>
  );
}
