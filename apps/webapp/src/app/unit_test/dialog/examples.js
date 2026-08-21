// useXyzDialogの使用例
export const dialogExample = `// useXyzDialogの使用例
const { open, close, isOpen, renderDialog } = useXyzDialog();

// ダイアログを開く
open({
  title: "ダイアログのタイトル",
  message: "ダイアログのメッセージ",
});

// ダイアログを閉じる
close();

// ダイアログの表示状態を確認
if (isOpen) {
  // ダイアログが開いている場合の処理
}

// コンポーネント内での使用
return (
  <>
    <Button onClick={() => open()}>ダイアログを開く</Button>
    {renderDialog()}
  </>
);`;

export const basicDialogExample = `// 基本的なダイアログの表示

const { open, onClose, isOpen, renderDialog } = useXyzDialog();

return (
  <>
    <Button onClick={() => {
        open({
            title: "基本的なダイアログ",
            message: "これは基本的なダイアログのテストです。",
        });
    }}>ダイアログを開く</Button>
    {renderDialog()}
  </>
);

`;
