"use client";

import * as React from "react";
import { components } from "@lib/client";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import {
  TestDialogGrid,
  TestDialogCard,
  TestDialogTitle,
  TestDialogDescription,
  TestDialogHeader,
  TestDialogMainTitle,
  CodeBlock,
} from "../styles";
import {
  wysiwygExample,
  wysiwygStdExample,
  wysiwygProExample,
  wysiwygCustomExample,
  wysiwygDisabledExample,
  wysiwygErrorExample,
} from "./examples";

const { Wysiwyg } = components;

const EMPTY_DOC = Object.freeze({
  type: "doc",
  content: [{ type: "paragraph" }],
});

/** @type {string[]} buildExtensions と同じキー順（テスト用） */
const EXTENSION_OPTIONS = [
  "link",
  "underline",
  "textAlign",
  "highlight",
  "placeholder",
  "image",
  "table",
  "taskList",
  "textStyle",
  "color",
];

function Page() {
  const [stdContent, setStdContent] = React.useState(EMPTY_DOC);
  const [proContent, setProContent] = React.useState(EMPTY_DOC);
  const [customContent, setCustomContent] = React.useState(EMPTY_DOC);
  const [disabledContent] = React.useState(EMPTY_DOC);
  const [errorContent, setErrorContent] = React.useState(EMPTY_DOC);

  const [enabledExtensions, setEnabledExtensions] = React.useState(() => [
    "link",
    "underline",
    "textAlign",
    "highlight",
    "placeholder",
    "table",
    "taskList",
    "textStyle",
    "color",
  ]);

  const toggleExtension = (key) => {
    setEnabledExtensions((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Wysiwyg</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Wysiwyg の使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{wysiwygExample}</CodeBlock>
              </div>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>std — StarterKit のみ</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{wysiwygStdExample}</CodeBlock>
              </div>
              <Wysiwyg
                mode="std"
                label="mode=std"
                helperText="太字・リスト等のみ。追加拡張なし。"
                content={stdContent}
                onChange={(_ed, { json }) => setStdContent(json)}
                minHeight={180}
              />
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>pro — 全拡張 + ツールバー</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{wysiwygProExample}</CodeBlock>
              </div>
              <Wysiwyg
                mode="pro"
                label="mode=pro"
                placeholder="プレースホルダー（pro で placeholder 拡張あり）"
                helperText="リンク・表・タスク・色など"
                content={proContent}
                onChange={(_ed, { json }) => setProContent(json)}
                minHeight={220}
              />
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>custom — enabledExtensions を切替</TestDialogTitle>
            <TestDialogDescription>
              <Typography variant="body2" sx={{ mb: 1 }}>
                チェックした拡張だけが有効になります（table を選ぶと Table 系 4 拡張をまとめて登録）。
              </Typography>
              <FormGroup row sx={{ flexWrap: "wrap", mb: 2 }}>
                {EXTENSION_OPTIONS.map((key) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        size="small"
                        checked={enabledExtensions.includes(key)}
                        onChange={() => toggleExtension(key)}
                      />
                    }
                    label={key}
                  />
                ))}
              </FormGroup>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{wysiwygCustomExample}</CodeBlock>
              </div>
              <Wysiwyg
                mode="custom"
                enabledExtensions={enabledExtensions}
                label="mode=custom"
                placeholder={enabledExtensions.includes("placeholder") ? "プレースホルダー有効時" : ""}
                helperText={`有効: ${enabledExtensions.length ? enabledExtensions.join(", ") : "（なし・StarterKit のみ）"}`}
                content={customContent}
                onChange={(_ed, { json }) => setCustomContent(json)}
                minHeight={220}
              />
              上記をconstのenabledにリストとして記載する
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>disabled / error</TestDialogTitle>
            <TestDialogDescription>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                無効
              </Typography>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{wysiwygDisabledExample}</CodeBlock>
              </div>
              <Wysiwyg mode="pro" label="disabled" disabled content={disabledContent} minHeight={120} sx={{ mb: 3 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                エラー + helperText
              </Typography>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{wysiwygErrorExample}</CodeBlock>
              </div>
              <Wysiwyg
                mode="std"
                label="エラー表示"
                error
                helperText="入力内容を確認してください"
                content={errorContent}
                onChange={(_ed, { json }) => setErrorContent(json)}
                minHeight={120}
              />
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
