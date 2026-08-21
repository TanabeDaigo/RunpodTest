/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - DatePicker Test Layout                           ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   DatePickerコンポーネントのテストレイアウト                  ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはDatePickerコンポーネントのテストページのレイアウトを定義します。
 * Next.jsのApp Routerの仕様に従い、メタデータの設定とレイアウトの提供を行います。
 *
 * @file layout.js
 * @module unit_test/datePicker/layout
 */

import Consts from "@common/config/consts";

/**
 * ページのメタデータを定義
 * @type {Object}
 * @property {string} title - ブラウザのタブに表示されるタイトル
 * @property {string} description - ページの説明文（SEO用）
 */
export const metadata = {
  title: `DatePicker テスト | ${Consts.NAME}`,
  description: "DatePickerコンポーネントのテストページ",
};

/**
 * レイアウトコンポーネント
 *
 * 子コンポーネントをそのまま表示するシンプルなレイアウトを提供します。
 * このレイアウトはDatePickerのテストページ全体に適用されます。
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {React.ReactNode} props.children - 子コンポーネント
 * @returns {JSX.Element} レイアウトコンポーネント
 */
export default function Layout({ children }) {
  return children;
}
