export const wysiwygExample = `
import { components } from '@lib/client';

const { Wysiwyg } = components;

// 制御: content に TipTap JSON または HTML 文字列
// 変更は onChange(editor, { json, html })

<Wysiwyg
  mode="std"
  label="標準"
  content={docJson}
  onChange={(editor, { json }) => setDocJson(json)}
/>`;

export const wysiwygStdExample = `
<Wysiwyg
  mode="std"
  label="mode=std（StarterKit のみ）"
  placeholder="ここに入力"
  content={content}
  onChange={(_, { json }) => setContent(json)}
/>`;

export const wysiwygProExample = `
<Wysiwyg
  mode="pro"
  label="mode=pro（全拡張）"
  placeholder="拡張ツールバー付き"
  content={content}
  onChange={(_, { json }) => setContent(json)}
/>`;

export const wysiwygCustomExample = `
const [enabled, setEnabled] = useState(['link', 'underline', 'table']);

<Wysiwyg
  mode="custom"
  enabledExtensions={enabled}
  label="mode=custom"
  content={content}
  onChange={(_, { json }) => setContent(json)}
/>`;

export const wysiwygDisabledExample = `
<Wysiwyg
  mode="pro"
  label="無効"
  disabled
  content={content}
/>`;

export const wysiwygErrorExample = `
<Wysiwyg
  mode="std"
  label="エラー表示"
  error
  helperText="入力内容を確認してください"
  content={content}
  onChange={(_, { json }) => setContent(json)}
/>`;
