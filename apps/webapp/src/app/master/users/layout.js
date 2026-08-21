import Consts from "@common/config/consts";

/**
 * ページのメタデータ
 * @type {Object}
 */
export const metadata = {
  title: `ユーザー管理 | ${Consts.NAME}`,
  description: "ユーザー管理",
};
/**
 * ユーザー管理ページのレイアウトコンポーネント
 */
export default function Layout({ children }) {
  return children;
}
