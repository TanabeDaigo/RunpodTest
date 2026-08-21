"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { sendMailUseExample, sendMailExample, sqsExample } from "./examples";
import { useState, useEffect } from "react";

const { useWebAppContext } = providers;
const log = new logjs("TestConfirm");
const api = new apijs("api/sendtest");


function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const [form, formProps] = useUnitTest({}, state, actions);
  const [inputMailTo, setInputMailTo] = useState('');
  const [inputMailCc, setInputMailCc] = useState('');
  const [inputMailBcc, setInputMailBcc] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputBody, setInputBody] = useState('');
  const inputStyle = {
    display: 'block',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '12px',
    padding: '8px 12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1.5px solid #ccc',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  };
  
  const inputFocusStyle = {
    borderColor: '#4A90E2',
    outline: 'none',
    boxShadow: '0 0 5px rgba(74, 144, 226, 0.5)',
  };
  
  const buttonStyle = {
    padding: '10px 24px',
    backgroundColor: '#4A90E2',
    color: 'white',
    fontWeight: '600',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const handleSend = async () => {
    try {
      const res = await api.post({
        mode: "sendMailTest",
        mailTo: "daigo.tanabe@kronometro.co.jp",
        mailCc: [" daigo.tanabe@kronometro.co.jp "," tdaigo56@gmail.com "],
        mailBcc: "",
        mail_title: inputTitle,
        mail_text: inputBody,
        option: { charset: 'Shift_JIS' } 
      });
      if (res.success) {
        alert(`送信完了`);
      } else {
        alert(`送信失敗（詳細はログ参照）`);
      }
    } catch (err) {
      console.error("送信中エラー", err);
      alert("送信中エラー");
    }
  };

  const handleCheckSqs = async () => {
    try {
      const res = await api.post({ mode: "checkData" });
      if (res?.success !== false) {
        alert("SQSチェック完了");
      } else {
        alert(`SQSチェック失敗（詳細はログ参照）`);
      }
    } catch (err) {
      console.error("SQSチェック中エラー", err);
      alert("SQSチェック中にエラーが発生しました");
    }
  };


  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test SendMail</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
          <TestDialogGrid>
            <TestDialogCard style={{ marginBottom: "1rem" }}>
              <TestDialogTitle>configの設定（AWSのユーザー情報等）</TestDialogTitle>
              <CodeBlock>{sendMailExample}</CodeBlock>
            </TestDialogCard>
          </TestDialogGrid>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>ASES（メール送信）の使用例</TestDialogTitle>
            <TestDialogDescription>
              <label style={{ fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                Toメールアドレス
              </label>
              <input
                type="email"
                value={inputMailTo}
                onChange={(e) => setInputMailTo(e.target.value)}
                style={{ ...inputStyle}}
                placeholder="to@example.com"
              />

              <label style={{ fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                Ccメールアドレス
              </label>
              <input
                type="email"
                value={inputMailCc}
                onChange={(e) => setInputMailCc(e.target.value)}
                style={{ ...inputStyle}}
                placeholder="cc@example.com"
              />

              <label style={{ fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                Bccメールアドレス
              </label>
              <input
                type="email"
                value={inputMailBcc}
                onChange={(e) => setInputMailBcc(e.target.value)}
                style={{ ...inputStyle}}
                placeholder="bcc@example.com"
              />

              <label style={{ fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                件名
              </label>
              <input
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                style={{ ...inputStyle}}
                placeholder="メールの件名"
              />

              <label style={{ fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                本文
              </label>
              <textarea
                value={inputBody}
                onChange={(e) => setInputBody(e.target.value)}
                style={{ ...inputStyle, height: '120px', resize: 'vertical'}}
                placeholder="メールの本文を入力してください"
              />

              <button
                onClick={handleSend}
                style={buttonStyle}
              >
                メール送信
              </button>
            </TestDialogDescription>
            
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{sendMailUseExample}</CodeBlock>
              </div>
              <ButtonContainer>{formProps.copyButton(sendMailUseExample)}</ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>SQS メッセージ確認</TestDialogTitle>
              <TestDialogDescription>
                <p>Amazon SQS キューから最大5件のメッセージを取得します。</p>
                <button
                  onClick={handleCheckSqs}
                  style={buttonStyle}
                >
                  SQS テスト実行
                </button>
              </TestDialogDescription>
            
              <TestDialogDescription>
                <div style={{ marginBottom: "1rem" }}>
                  <CodeBlock>{sqsExample}</CodeBlock>
                </div>
                <ButtonContainer>{formProps.copyButton(sqsExample)}</ButtonContainer>
              </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
