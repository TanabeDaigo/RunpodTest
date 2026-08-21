"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, providers } from "@lib/client";
import {
  TestDialogGrid,
  TestDialogCard,
  TestDialogTitle,
  TestDialogDescription,
  TestDialogHeader,
  TestDialogMainTitle,
  ButtonContainer
} from "../styles";
import { Button, Typography, Box } from "@mui/material";
import { useState, useCallback } from "react";

const { useWebAppContext } = providers;
const log = new logjs("TestConfirm");

function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  const [form, formProps] = useUnitTest({}, state, actions);

  const [dragOver, setDragOver] = useState(false);

  const handleCsvDownload = () => {
    const headers = ["名前", "年齢", "職業"];
    const rows = [
      ["田中でーーーす", 30, "エンジニア？？？"],
      ["佐藤どーーーう", 25, "デザイナーァぁぁぁぁぁぁぁ"],
      ["鈴木ちーーーす", 28, "マネージャー！！！！！"],
      ["田中でーーーす", 30, "エンジニア？？？"],
      ["佐藤どーーーう", 25, "デザイナーァぁぁぁぁぁぁぁ"],
      ["鈴木ちーーーす", 28, "マネージャー！！！！！"],
      ["田中でーーーす", 30, "エンジニア？？？"],
      ["佐藤どーーーう", 25, "デザイナーァぁぁぁぁぁぁぁ"],
      ["鈴木ちーーーす", 28, "マネージャー！！！！！"],
    ];

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Daigosample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    log.info("CSV downloaded.");
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      log.info("CSV Upload 内容：", text);
    };
    reader.onerror = (e) => {
      log.error("CSV読み込みエラー", e);
    };
    reader.readAsText(file);
  };

  const handleCsvUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer?.files?.[0];
    if (file && file.type === "text/csv") {
      handleFile(file);
    } else {
      log.warn("CSVファイルのみ対応しています。");
    }
  }, []);

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test daigoTest</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          {/* CSVダウンロード */}
          <TestDialogCard>
            <TestDialogTitle>DownLoad example</TestDialogTitle>
            <TestDialogDescription>
              下のボタンをクリックするとサンプルCSVをダウンロードします。
            </TestDialogDescription>
            <ButtonContainer>
              <Button variant="contained" onClick={handleCsvDownload}>
                CSVダウンロード
              </Button>
            </ButtonContainer>
          </TestDialogCard>

          {/* CSVアップロード（ボタン） */}
          <TestDialogCard>
            <TestDialogTitle>Upload example</TestDialogTitle>
            <TestDialogDescription>
              ボタンで選択、または下のエリアにドラッグ＆ドロップでもアップロード可能です。
            </TestDialogDescription>
            <ButtonContainer>
              <Button variant="outlined" component="label">
                CSVアップロード
                <input type="file" accept=".csv" hidden onChange={handleCsvUpload} />
              </Button>
            </ButtonContainer>

            {/* CSVアップロード（ドロップゾーン） */}
            <Box
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              sx={{
                mt: 2,
                p: 3,
                border: "2px dashed",
                borderColor: dragOver ? "primary.main" : "grey.400",
                borderRadius: 2,
                textAlign: "center",
                color: dragOver ? "primary.main" : "text.secondary",
                transition: "border-color 0.2s, color 0.2s",
                cursor: "pointer"
              }}
            >
              <Typography>
                ここにCSVファイルをドラッグ&ドロップしてください
              </Typography>
            </Box>

          </TestDialogCard>

          <TestDialogCard>
          <div>
          {formProps.upload({
            label: 'ファイルをアップロード',
            onSubmit: files => {
              files.forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                  console.log(`ファイル名: ${file.name}`);
                  console.log('内容:', reader.result);  // ここにファイルの中身（テキスト or Base64）が入る
                };
                // テキストファイルなら readAsText、画像などバイナリは readAsDataURL
                reader.readAsText(file);  // 例：テキストファイルとして読み込み
              });
            },
          })}

          {formProps.download({
            label:"Download Test"
          })}
            </div>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
