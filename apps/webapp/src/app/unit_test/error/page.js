"use client";

import { providers } from "@lib/client";
const { useWebAppContext } = providers;
/**
 * エラーページのテスト用コンポーネント
 * @returns {JSX.Element} テスト用のエラーページ
 */
export default function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};

  const handleError = () => {
    try {
      // エラーを発生させる前にログを出力
      console.log("エラーを発生させます");
      throw new Error("テストエラー");
    } catch (error) {
      // エラーをキャッチした時のログを出力
      console.error("エラーが発生しました:", error);
      // エラーを再スロー
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">エラーページテスト</h1>
      <button onClick={handleError} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
        エラーを発生させる
      </button>
    </div>
  );
}
