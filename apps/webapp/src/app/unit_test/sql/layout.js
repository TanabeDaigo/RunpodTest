/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - SQL Test Layout                                  ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   SQLコンポーネントのテストレイアウト                         ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはSQLコンポーネントのテストページのレイアウトを定義します。
 * メタデータの設定とレイアウトの提供を行います。
 *
 * @file layout.js
 * @module unit_test/sql/layout
 */

import Consts from "@common/config/consts";

/**
 * ページのメタデータ
 * @type {Object}
 */
export const metadata = {
  title: `SQL テスト | ${Consts.NAME}`,
  description: "SQLコンポーネントのテストページ",
};

/**
 * レイアウトコンポーネント
 * @param {Object} props - コンポーネントのプロパティ
 * @param {React.ReactNode} props.children - 子要素
 * @returns {JSX.Element} レイアウトコンポーネント
 */
export default function Layout({ children }) {
  return children;
}
