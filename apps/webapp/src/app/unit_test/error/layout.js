/**
 * エラーテストページのレイアウトコンポーネント
 * @param {Object} props - コンポーネントのプロパティ
 * @param {React.ReactNode} props.children - 子コンポーネント
 * @returns {JSX.Element} レイアウトコンポーネント
 */
export default function Layout({ children }) {
  return <div className="min-h-screen">{children}</div>;
}
