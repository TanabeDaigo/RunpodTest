/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - useSwitchEx Test Layout                             ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   useSwitchExコンポーネントのテストレイアウト                        ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはuseSwitchExコンポーネントのテストページのレイアウトを定義します。
 * メタデータの設定とレイアウトの提供を行います。
 *
 * @file layout.js
 * @module unit_test/useSwitchEx/layout
 */
import Consts from "@common/config/consts";

/**
 * ページのメタデータ
 * @type {Object}
 */
export const metadata = {
  title: `useSwitchEx 関数一覧テスト | ${Consts.NAME}`,
  description: "useSwitchExコンポーネントのテストページ",
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
