// iconMenuのテストケース
export const iconMenuExample = `
{/* 基本的な使用例 */}
{formProps.iconMenu("Id",{
  options: [
    {value: "Select1"},
    {value: "Select2"},
  ],
})}

`;

export const iconMenuTest1 = `
{/* 通常のアイコンメニュー */}
{formProps.iconMenu("test1", {
  options: [
    {value: "Select1"},
    {value: "Select2"},
  ],
  after_func: (form) => {
    console.log("アイコンメニューがクリックされました", form.test1);
  },
})}
`;

export const iconMenuTest2 = `
{/* 無効化されたのアイコンメニュー */}
{formProps.iconMenu("test2", {
  disabled: true,
  options: [
    {value: "Select1"},
    {value: "Select2"},
  ],
  after_func: (form) => {
    console.log("アイコンメニューがクリックされました", form.test2);
  },
})}
`;

export const iconMenuTest3 = `
{/* カラー指定のアイコンメニュー */}
{formProps.iconMenu("test3", {
  color: "primary",
  options: [
    {value: "Select1"},
    {value: "Select2"},
  ],
  after_func: (form) => {
    console.log("アイコンメニューがクリックされました", form.test3);
  },
})}

`;

export const iconMenuTest4 = `
{/* サイズ指定のアイコンメニュー */}
{formProps.iconMenu("test4", {
  fontSize: "large",
  options: [
    {value: "Select1"},
    {value: "Select2"},
  ],
  after_func: (form) => {
    console.log("アイコンメニューがクリックされました", form.test4);
  },
})}
`;

export const iconMenuTest5 = `
{/* ツールチップのテキストのアイコンメニュー */}
{formProps.iconMenu("test5", {
  tooltip:"This is IconMenu",
  options: [
    {value: "Select1"},
    {value: "Select2"},
  ],
  after_func: (form) => {
    console.log("アイコンメニューがクリックされました", form.test5)
  },
})}
`;

export const iconMenuTest6 = `
{/* 表示無効化のアイコンメニュー */}
{formProps.iconMenu("test6", {
  show: false,
  options: [
    {value: "Select1"},
    {value: "Select2"},
  ],
  after_func: (form) => {
    console.log("アイコンメニューがクリックされました", form.test6);
  },
})}
`;

export const iconMenuTest7 = `
{/* スタイルが適応されたアイコンメニュー */}
{formProps.iconMenu("test7", {
  options: [
    {value: "Select1"},
    {value: "Select2"},
  ],
  after_func: (form) => {
    console.log("アイコンメニューがクリックされました", form.test7);
  },
  sx: { backgroundColor: 'lightblue' },
})}
`;

export const iconMenuTest8 = `
{/* 選択不可の選択肢があるアイコンメニュー */}
{formProps.iconMenu("test8", {
  options: [
    {value: "Select1", disabled: false},
    {value: "Select2", disabled: true},
  ],
  after_func: (form) => {
    console.log("アイコンメニューがクリックされました", form.test8);
  },
})}
`;

export const iconMenuTest9 = `
{/* 選択肢ごとにイベントがあるアイコンメニュー */}
{formProps.iconMenu("test9", {
  options: [
    {
      value: "Google",
      onClick: () => window.open("https://www.google.com", "_blank"),
    },
    {
      value: "YouTube",
      onClick: () => window.open("https://www.youtube.com", "_blank"),
    },
    {
      value: "共通の処理",
    },
  ],
  after_func: (form) => {
    console.log("アイコンメニューがクリックされました", form.test9);
  },
})}
`;


export const iconMenuTest10 = `
{/* ポップ先が変更されているアイコンメニュー */}
{formProps.iconMenu("test10", {
  options: [
    {value: "Select1"},
    {value: "Select2"},
  ],
  anchorOrigin:{
    vertical: "top",
    horizontal: "right",
  },
  transformOrigin:{
    vertical: "bottom",
    horizontal: "right",
  },
  after_func: (form) => {
    console.log("アイコンメニューがクリックされました", form.test10);
  },
})}
`;
