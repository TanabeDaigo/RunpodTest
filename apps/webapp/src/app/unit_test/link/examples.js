export const linkExample = `// リンクの使用例
const linkProps = {
  href: "/dashboard",
  children: "リンクテキスト",
  onClick: () => {
    console.log("リンクがクリックされました");
  }
};

// リンクの作成
formProps.link(linkProps);`;

export const linkTest1 = `// 通常のリンク
formProps.link({
  href: "/dashboard",
  children: "通常のリンク"
});`;

export const linkTest2 = `// 外部リンク
formProps.link({
  href: "https://www.yahoo.co.jp/",
  children: "外部リンク",
  target: "_blank",
  rel: "noopener noreferrer"
});`;

export const linkTest3 = `// アイコン付きリンク
import HomeIcon from "@mui/icons-material/Home";

formProps.link({
  href: "/dashboard",
  children: (
    <>
      <HomeIcon sx={{ mr: 1 }} />
      ダッシュボードへの移動
    </>
  )
});`;

export const linkTest4 = `// 無効化リンク
formProps.link({
  href: "/dashboard",
  children: "無効化リンク",
  disabled: true
});`;

export const linkTest5 = `// カスタムスタイルのリンク
formProps.link({
  href: "/dashboard",
  children: "カスタムスタイル",
  style: {
    color: "#4CAF50",
    textDecoration: "none",
    fontWeight: "bold",
    "&:hover": {
      color: "#45a049"
    }
  }
});`;

export const linkTest6 = `// テーマ対応スタイルのリンク
formProps.link({
  href: "/dashboard",
  children: "テーマ対応スタイル",
  sx: {
    color: "primary.main",
    textDecoration: "none",
    fontWeight: "bold",
    "&:hover": {
      color: "primary.dark"
    }
  }
});`;

export const linkTest7 = `// サイズ指定リンク
formProps.link({
  href: "/dashboard",
  children: "大きいサイズ",
  size: "large"
});`;

export const linkTest8 = `// カラー指定リンク
formProps.link({
  href: "/dashboard",
  children: "警告色",
  color: "warning"
});`;

export const linkTest9 = `// 下線なしリンク
formProps.link({
  href: "/dashboard",
  children: "下線なし",
  underline: "none"
});`;

export const linkTest10 = `// カスタムクラスリンク
formProps.link({
  href: "/dashboard",
  children: "カスタムクラス",
  className: "custom-link"
});`;

export const linkTest11 = `// ツールチップ付きリンク
formProps.link({
  href: "/dashboard",
  children: "ツールチップ",
  title: "リンクの説明"
});`;

export const linkTest12 = `// イベントハンドラ付きリンク
formProps.link({
  href: "/dashboard",
  children: "イベントハンドラ",
  onClick: (e) => {
    e.preventDefault();
    console.log("リンクがクリックされました");
  }
});`;

export const linkTest13 = `// 条件付きリンク
formProps.link({
  href: "/dashboard",
  children: "条件付き",
  disabled: !form["isEnabled"],
  onClick: (e) => {
    if (!form["isEnabled"]) {
      e.preventDefault();
    }
  }
});`;

export const linkTest14 = `// カスタムコンポーネントリンク
formProps.link({
  href: "/dashboard",
  children: "カスタムコンポーネント",
  sx: {
    color: "secondary.main",
    textDecoration: "none",
    fontWeight: "bold",
    "&:hover": {
      color: "secondary.dark",
      textDecoration: "underline"
    }
  }
});`;

export const linkTest15 = `// 複合スタイルリンク
formProps.link({
  href: "/dashboard",
  children: "複合スタイル",
  sx: {
    color: "primary.main",
    textDecoration: "none",
    fontWeight: "bold",
    padding: "8px 16px",
    borderRadius: "4px",
    backgroundColor: "background.paper",
    "&:hover": {
      color: "primary.dark",
      backgroundColor: "action.hover"
    }
  }
});`;
