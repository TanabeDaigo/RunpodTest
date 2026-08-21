# Image Component

Next.jsのImageコンポーネントをラップしたカスタム画像コンポーネントです。

## 特徴

- Next.jsのImageコンポーネントの最適化機能を活用
- ローディング状態の表示
- エラーハンドリング
- デフォルトパラメータの適用
- デバッグモード対応
- Material-UIのスタイリング対応

## 基本的な使用方法

```jsx
import Image from "@metrojs/components/mui/image/Image";

// 基本的な使用例
<Image
  src="/path/to/image.jpg"
  alt="画像の説明"
  width={300}
  height={200}
/>

// クリックイベント付き
<Image
  src="/path/to/image.jpg"
  alt="クリック可能な画像"
  width={300}
  height={200}
  onClick={(e) => console.log("画像がクリックされました")}
/>

// 親要素を埋める
<Image
  src="/path/to/image.jpg"
  alt="フルサイズ画像"
  fill
  style={{ position: "relative" }}
/>

// デバッグモード
<Image
  src="/path/to/image.jpg"
  alt="デバッグ画像"
  width={300}
  height={200}
  is_debug={true}
/>
```

## プロパティ

| プロパティ  | 型       | デフォルト                   | 説明                           |
| ----------- | -------- | ---------------------------- | ------------------------------ |
| src         | string   | -                            | 画像のソースURL（必須）        |
| alt         | string   | ""                           | 代替テキスト                   |
| width       | number   | undefined                    | 画像の幅                       |
| height      | number   | undefined                    | 画像の高さ                     |
| fill        | boolean  | false                        | 親要素を埋める                 |
| priority    | boolean  | false                        | 優先読み込み                   |
| quality     | number   | 75                           | 画像品質（1-100）              |
| placeholder | string   | "empty"                      | プレースホルダー（blur/empty） |
| blurDataURL | string   | undefined                    | ブラー画像のデータURL          |
| sizes       | string   | undefined                    | レスポンシブ画像のサイズ       |
| loader      | function | undefined                    | カスタムローダー関数           |
| unoptimized | boolean  | false                        | 最適化を無効化                 |
| style       | object   | {}                           | カスタムスタイル               |
| className   | string   | ""                           | CSSクラス名                    |
| onLoad      | function | undefined                    | 読み込み完了時のコールバック   |
| onError     | function | undefined                    | エラー時のコールバック         |
| onClick     | function | undefined                    | クリック時のコールバック       |
| showLoading | boolean  | true                         | ローディング表示の有無         |
| showError   | boolean  | true                         | エラー表示の有無               |
| errorText   | string   | "画像を読み込めませんでした" | エラー時のテキスト             |
| is_debug    | boolean  | false                        | デバッグモード                 |

## スタイリング

Material-UIのテーマシステムと統合されており、以下のスタイルが適用されます：

- 角丸の適用
- ローディングインジケーターの表示
- エラー状態の表示
- ホバー効果（クリック可能な場合）

## 注意事項

- `src`プロパティは必須です
- `fill`を使用する場合は、親要素に`position: relative`を設定してください
- Next.jsのImageコンポーネントの制限に従ってください
