/**
 * @file layout.js
 * @module unit_test/sakutto/layout
 */
import Consts from "@common/config/consts";

export const metadata = {
  title: `サクッと記録（Sakutto） | ${Consts.NAME}`,
  description: "毎日サクッと子供の成長を記録できるアプリ",
};

export default function Layout({ children }) {
  return children;
}
