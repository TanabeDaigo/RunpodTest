"use client";

import { useEffect, useState } from "react";
import { LoginContainer, LoginView, LoginBox, Title, TitleText, LoginBody, ErrorMessage, InputWrapper, Input, Button } from "./styles";

import logjs from "@metrojs/logjs";
const log = new logjs("login/page");

import { useLogin } from "./useLogin";
import { providers } from "@lib/client";
const { useWebAppContext } = providers;
/**
 * ログインページコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Object} props.params - 動的ルートパラメータ
 * @param {Object} props.searchParams - URLのクエリパラメータ
 * @returns {JSX.Element} ログインページのコンポーネント
 */
export default function Page() {
  // コンテキストの使用
  const webAppContext = useWebAppContext();
  const { state, actions, params } = webAppContext || {};

  // デバッグ用
  //log.info("params", params);
  //log.info("state", state);

  const [isMounted, setIsMounted] = useState(false);

  const [form, formProps] = useLogin();

  // ハイドレーションを無効にする
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <LoginContainer>
      <LoginView>
        <LoginBox>
          <Title>
            <TitleText>MetroJs Sign In</TitleText>
          </Title>
          <form>
            <LoginBody>
              {form?.error && <ErrorMessage>{form?.error}</ErrorMessage>}

              <InputWrapper>{formProps.input_login_id()}</InputWrapper>

              <InputWrapper>{formProps.input_password()}</InputWrapper>

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  formProps.login();
                }}
                disabled={form?.loading}
              >
                {form?.loading ? "ログイン中..." : "ログイン"}
              </Button>
            </LoginBody>
          </form>
        </LoginBox>
      </LoginView>
    </LoginContainer>
  );
}
