/**
 * @file layout.js
 * @description Wysiwyg 単体テストページのレイアウト・メタデータ
 */

import Consts from "@common/config/consts";

export const metadata = {
  title: `Wysiwyg テスト | ${Consts.NAME}`,
  description: "Wysiwyg（Tiptap）コンポーネントのテストページ",
};

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function Layout({ children }) {
  return children;
}
