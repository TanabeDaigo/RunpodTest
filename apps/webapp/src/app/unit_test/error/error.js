"use client";

import { Error } from "@repo/common/client/pages";

/**
 * エラーページコンポーネント
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Error} props.error - エラーオブジェクト
 * @param {Function} props.reset - エラーをリセットする関数
 * @returns {JSX.Element} エラーページ
 */
export default function ErrorPage({ error, reset }) {
  // デバッグ用のログを追加
  console.log("Error component rendered:", error);
  console.log("Reset function:", reset);

  // エラーオブジェクトの詳細を表示
  if (error) {
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);
    console.log("Error stack:", error.stack);
  }

  return <Error error={error} reset={reset} />;
}
