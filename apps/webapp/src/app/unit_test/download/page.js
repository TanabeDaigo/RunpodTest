"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
const { useWebAppContext } = providers;
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  switchExample,
  switchTest1,
} from "./examples";

const log = new logjs("TestSwitch");
const api = new apijs("api/downloadtest");

export default function Page() {
  const initState = {};
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest(initState, state, actions);
  const [csvText, setCsvText] = useState("");

  const handleDownload = async () => {
    try {
      const parsed = csvText
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => line.split(",").map(cell => cell.trim()));

      if (parsed.length === 0) {
        alert("入力されたデータが空です。");
        return;
      }
      const res = await api.post({
        mode: "downloadTest",
        filename: "testcsv.csv",
        data: parsed,
      });
      if (!res.success) {
        throw new Error(res.message || "失敗しました");
      }
  
      // 文字列をBlob化してダウンロード
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Download</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Downloadの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchExample}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchExample)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース</TestDialogTitle>
            <TestDialogDescription>
            <textarea
              rows={10}
              cols={50}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" ,
                border: "2px dashed",
                borderRadius: 2,}}
            />
            {formProps.download({
            label: 'ファイルをダウンロード',
            onClick: handleDownload,
          })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
     </TestDialogGrid>
      </div>
    </div>
  );
}
