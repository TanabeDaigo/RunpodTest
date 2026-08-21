"use client";

import { NotFound } from "@repo/common/client/pages";

/**
 * Not Foundページコンポーネント
 * @returns {JSX.Element} Not Foundページ
 */
export default function NotFoundPage() {
  console.log("Not Found component rendered"); // デバッグ用

  return <NotFound />;
}
