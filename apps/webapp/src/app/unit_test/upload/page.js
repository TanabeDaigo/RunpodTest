"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
const { useWebAppContext } = providers;
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import {
  uploadExample,
  uploadTest1,
  uploadTest1Example,
  uploadTest2,
  uploadTest2Example1,
  uploadTest2Example2,
} from "./examples";

const log = new logjs("TestUpload");
const api = new apijs("api/upload");

export default function Page() {
  const initState = {};
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest(initState, state, actions);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    const fetchUploaded = async () => {
      try {
        const res = await api.post({ mode: "listUploadedFiles" });
        if (res.success) {
          setUploadedFiles(res.files);
        }
      } catch (err) {
        console.error("既存ファイル取得失敗:", err);
      }
    };
    fetchUploaded();
  }, []);

  const handleUpload = async (files) => {
    const previews = [];

    for (const file of files) {
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        if (file.type.startsWith("text") || file.name.endsWith(".csv")) {
          reader.readAsText(file);
          reader.onload = () => resolve(reader.result);
        } else {
          reader.readAsArrayBuffer(file);
          reader.onload = () => resolve(Buffer.from(reader.result).toString("base64"));
        }

        reader.onerror = reject;
      });
      const isBase64 = !file.type.startsWith("text") && file.type !== "";

      previews.push({
        name: file.name,
        type: file.type,
        text,
        isBase64,
      });
    }

    try {
      const res = await api.post({
        mode: "uploadToS3",
        files: previews,
      });

      if (!res.success) {
        alert(res.message || "アップロードに失敗しました");
        return;
      }

      console.log("アップロード成功:", res.uploaded);

      setUploadedFiles((prev) => [...prev, ...res.uploaded]);

    } catch (err) {
      console.error("エラー:", err);
    }
  };

  const handleBatchDownload = async () => {
    const selectedKeys = uploadedFiles
      .filter((file) => selectedFiles[file.url])
      .map((file) => file.s3Key);
  
    if (selectedKeys.length === 0) {
      alert("ファイルが選択されていません");
      return;
    }
  
    try {
      const res = await api.post({
        mode: "downloadSelectedAsTarGz",
        files: selectedKeys,
      });
  
      if (!res.success) {
        alert(res.message || "ダウンロードに失敗しました");
        return;
      }
  
      const blob = new Blob([Uint8Array.from(atob(res.buffer), c => c.charCodeAt(0))], {
        type: "application/gzip",
      });
  
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename || "files.gz";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("バッチダウンロードエラー:", err);
    }
  };

  const handleSendSelectedFilesByMail = async () => {
    const selectedKeys = uploadedFiles
      .filter((file) => selectedFiles[file.url])
      .map((file) => file.s3Key);
  
    if (selectedKeys.length === 0) {
      alert("ファイルが選択されていません");
      return;
    }
  
    try {
      const res = await api.post({
        mode: "sendSelectedFilesByMail",
        files: selectedKeys,
        mailTo: "tdaigo56@gmail.com",
        mailCc: "",
        mailBcc: "",
        mail_title: "mailTitle",
        mail_text: "mailText",
        attachmentName: "selected_files.tar.gz",
      });
  
      if (!res.success) {
        alert(res.message || "メール送信に失敗しました");
        return;
      }
  
      alert("メール送信に成功しました。メッセージID: " + res.messageId);
    } catch (err) {
      console.error("メール送信エラー:", err);
      alert("メール送信中にエラーが発生しました");
    }
  };

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Upload</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Uploadの設定方法</TestDialogTitle>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{uploadExample}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(uploadExample)}</ButtonContainer>
          </TestDialogCard>
        </TestDialogGrid>

        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>Uploadの基本的なAPI例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{uploadTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(uploadTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
          
          <TestDialogCard>
            <TestDialogTitle>テストケース1</TestDialogTitle>
            <TestDialogDescription>
            {formProps.upload({
            label: 'ファイルをアップロード',
            onClick: handleUpload,
          })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{uploadTest1Example}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(uploadTest1Example)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>

        <TestDialogGrid>

        <TestDialogCard>
            <TestDialogTitle>Upload,Download,メール送信の使用例</TestDialogTitle>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{uploadTest2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(uploadTest2)}</ButtonContainer>
          </TestDialogCard>

          <TestDialogCard>
            <div style={{ marginTop: "2rem" }}>
              <TestDialogTitle>S3アップロード済みファイル</TestDialogTitle>
              <ul style={{ listStyle: "none", padding: 0 }}>
              {uploadedFiles.map((file, index) => (
                <div key={index} style={{ display: "flex", }}>
                  {formProps.checkbox(`file_${index}`, {
                    label: (
                      <span style={{
                        display: "inline-block",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#1976d2",
                        cursor: "pointer"
                      }}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          {file.name}
                        </a>
                      </span>
                    ),
                    onChange: (e) => {
                      setSelectedFiles((prev) => ({
                        ...prev,
                        [file.url]: e.target.checked,
                      }));
                    },
                  })}
                </div>
              ))}
              </ul>
              {formProps.button("download", {
                children: "選択したファイルをダウンロード",
                onClick: handleBatchDownload,
              })}
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{uploadTest2Example1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(uploadTest2Example1)}</ButtonContainer>
              {formProps.button("download", {
                children: "選択したファイルをメール送信",
                onClick: handleSendSelectedFilesByMail,
              })}
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{uploadTest2Example2}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(uploadTest2Example2)}</ButtonContainer>
            </div>
          </TestDialogCard>
{/* 
          <TestDialogCard>
            <TestDialogTitle>テストケース1 CSVファイル（.csv）のみアップロード可能</TestDialogTitle>
            <TestDialogDescription>
            {formProps.upload({
            label: 'CSVファイルをアップロード',
            isCsv: true,
            onClick: handleUpload,
          })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース2 画像ファイル（jpg/png/gifなど）のみアップロード可能</TestDialogTitle>
            <TestDialogDescription>
            {formProps.upload({
            label: '画像ファイルをアップロード',
            isImage: true,
            onClick: handleUpload,
          })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>テストケース3 PDFファイル（.pdf）のみアップロード可能</TestDialogTitle>
            <TestDialogDescription>
            {formProps.upload({
            label: 'PDFファイルをアップロード',
            isAppPdf: true,
            onClick: handleUpload,
          })}
            </TestDialogDescription>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{switchTest1}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(switchTest1)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard> */}
        </TestDialogGrid>
      </div>
    </div>
  );
}
