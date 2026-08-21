/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - useRadioEx Test Layout                             ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   useRadioExコンポーネントのテストレイアウト                        ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはuseRadioExコンポーネントのテストページのレイアウトを定義します。
 * メタデータの設定とレイアウトの提供を行います。
 *
 * @file layout.js
 * @module unit_test/useRadioEx/layout
 */
import Consts from "@common/config/consts";

/**
 * ページのメタデータ
 * @type {Object}
 */
export const metadata = {
  title: `useRadioEx 関数一覧テスト | ${Consts.NAME}`,
  description: "useRadioExコンポーネントのテストページ",
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
