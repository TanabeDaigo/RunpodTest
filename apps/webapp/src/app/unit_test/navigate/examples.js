export const navigationExample = `// ナビゲーションの使用例
const { navigate } = hooks.useNavigation();

// 基本的なページ遷移
navigate("/dashboard");  // ダッシュボードへ移動
navigate("/projects");   // プロジェクト一覧へ移動
navigate("/account");    // アカウント設定へ移動

// 履歴操作
navigate(-1);  // 前のページに戻る
navigate(1);   // 次のページに進む
navigate(0);   // 現在のページをリフレッシュ

// オプション付きの遷移
navigate("/dashboard", { replace: true });  // 履歴を置き換えて遷移
navigate("/projects", { state: { from: "home" } });  // 状態を保持して遷移

// クエリパラメータ付きの遷移
navigate("/search?q=test");  // 検索ページへ移動（クエリパラメータ付き）
navigate("/user?id=123");    // ユーザー詳細ページへ移動（ID付き）`;
