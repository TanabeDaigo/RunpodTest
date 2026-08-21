import { Consts } from "@lib/client";

export const metadata = {
  title: `FormEx テスト | ${Consts.NAME}`,
  description: "FormEx機能のテストページ",
};

export default function Layout({ children }) {
  return children;
}
