"use client";

// switchの使用例
export const switchExample = `{/* switchの基本的な使用例 */}
import { useUnitTest } from "../useUnitTest";

{/* コンポーネント内で */}
const [form, formProps] = useUnitTest({});

{/* 基本的な使用例 */}
{formProps.toggleSwitch("switch", {
after_func: (form) => {
  console.log("スイッチの状態:", form.switch);
}
})};`;

{/* テストケース */}
export const switchTest1 = `{/* テスト1 - 基本的なswitch */}
{formProps.toggleSwitch("test1", {
after_func: (form) => {
  console.log("スイッチの状態:", form.test1);
}
})};`;

export const switchTest2 = `{/* テスト2 - 無効化されたswitch */}
{formProps.toggleSwitch("test2", {
  disabled: true,
  after_func: (form) => {
    console.log("スイッチの状態:", form.test2);
  }
})};`;

export const switchTest3 = `{/* テスト3 - カスタムカラーのswitch */}
{formProps.toggleSwitch("test3", {
  color: "secondary",
  after_func: (form) => {
    console.log("スイッチの状態:", form.test3);
  }
})};`;

export const switchTest4 = `{/* テスト4 - カスタムサイズのswitch */}
{formProps.toggleSwitch("test4", {
  size: "small",
  after_func: (form) => {
    console.log("スイッチの状態:", form.test4);
  }
})};`;

export const switchTest5 = `{/* テスト5 - チェック済みのSwitch ※トグル可 */}
{formProps.toggleSwitch("test5", {
  defaultChecked: true,
  after_func: (form) => {
    console.log("スイッチの状態:", form.test5);
  }
})};`;

export const switchTest6 = `{/* テスト6 - チェック済みのSwitch ※トグル不可 */}
{formProps.toggleSwitch("test6", {
  checked: true,
  after_func: (form) => {
    console.log("スイッチの状態は変わりません");
  }
})};`;

export const switchTest7 = `{/* テスト7 - Rippleエフェクト無効化のSwitch */}
{formProps.toggleSwitch("test7", {
  disableRipple: true,
  after_func: (form) => {
    console.log("スイッチの状態:", form.test7);
  }
})};`;

export const switchTest8 = `{/* テスト8 - ラベル付きのSwitch */}
{formProps.toggleSwitch("test8", {
  label: "ラベル付きスイッチ",
  after_func: (form) => {
    console.log("スイッチの状態:", form.test8);
  }
})};`;

export const switchTest9 = `{/* テスト9 - カスタムラベル付きのSwitch */}
{formProps.toggleSwitch("test9", {
  label: "カスタムラベル付きスイッチ",
  labelPlacement:"bottom",
  sx:{color:"red"},
  after_func: (form) => {
    console.log("スイッチの状態:", form.test9);
  }
})};`;