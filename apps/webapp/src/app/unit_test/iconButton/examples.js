// iconButtonのテストケース
export const iconButtonExample = `
// 基本的な使用例
formProps.iconButton("edit", {
  title: "編集",
  onClick: () => {
    console.log("編集ボタンがクリックされました");
  },
});
`;

export const iconButtonTest1 = `
// 通常のアイコンボタン
formProps.iconButton("edit", {
  title: "編集",
  onClick: () => {
    console.log("編集ボタンがクリックされました");
  },
});
`;

export const iconButtonTest2 = `
// 無効化されたアイコンボタン
formProps.iconButton("delete", {
  title: "削除",
  disabled: true,
  onClick: () => {
    console.log("削除ボタンがクリックされました");
  },
});
`;

export const iconButtonTest3 = `
// カラー指定のアイコンボタン
formProps.iconButton("view", {
  title: "表示",
  color: "primary",
  onClick: () => {
    console.log("表示ボタンがクリックされました");
  },
});
`;

export const iconButtonTest4 = `
// サイズ指定のアイコンボタン
formProps.iconButton("cart", {
  title: "カート",
  size: "large",
  onClick: () => {
    console.log("カートボタンがクリックされました");
  },
});
`;

export const iconButtonTest5 = `
// カスタムアイコンのアイコンボタン
formProps.iconButton("finger", {
  title: "指紋認証",
  onClick: () => {
    console.log("指紋認証ボタンがクリックされました");
  },
});
`;

export const iconButtonTest6 = `
// アラームアイコンボタン
formProps.iconButton("alarm", {
  title: "アラーム",
  onClick: () => {
    console.log("アラームボタンがクリックされました");
  },
});
`;

export const iconButtonTest7 = `
// 送信アイコンボタン
formProps.iconButton("send", {
  title: "送信",
  onClick: () => {
    console.log("送信ボタンがクリックされました");
  },
});
`;

export const iconButtonTest8 = `
// コピーアイコンボタン
formProps.iconButton("copy", {
  title: "コピー",
  onClick: () => {
    console.log("コピーボタンがクリックされました");
  },
});
`;

// IconButtonテスト9 - style指定のアイコンボタン
export const iconButtonTest9 = `formProps.iconButton("edit", {
  title: "編集",
  style: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    "&:hover": {
      backgroundColor: "#45a049",
      transform: "scale(1.1)"
    }
  },
  onClick: () => {
    console.log("編集ボタンがクリックされました");
  },
});`;

// IconButtonテスト10 - sx指定のアイコンボタン
export const iconButtonTest10 = `formProps.iconButton("edit", {
  title: "編集",
  sx: {
    backgroundColor: "primary.main",
    color: "white",
    padding: "8px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    "&:hover": {
      backgroundColor: "primary.dark",
      transform: "scale(1.1)"
    },
    "&:active": {
      transform: "scale(0.95)"
    }
  },
  onClick: () => {
    console.log("編集ボタンがクリックされました");
  },
});`;
