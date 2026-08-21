export const loadingExample = `// ローディングの使用例
// showLoading: ローディング表示
appProps.showLoading();

// hideLoading: ローディング非表示
appProps.hideLoading();

// 非同期処理でのローディング表示
async function fetchData() {
  appProps.showLoading();
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } finally {
    appProps.hideLoading();
  }
}

// withLoading: ローディングを自動で制御しながら非同期処理を実行
await appProps.withLoading(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // ここでAPI通信や重い処理を実行
});
`;
