"use client";

import { useUnitTest } from "../useUnitTest";
import { logjs, apijs, providers, hooks } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock, ButtonContainer } from "../styles";
import { formExExample } from "./examples";

const { useWebAppContext } = providers;
const log = new logjs("TestFormEx");

function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  //log.info("state", state);
  //log.info("actions", actions);

  const initState = {
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  };
  const [form, formProps] = useUnitTest(initState, state, actions);

  log.info("form", form);
  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test FormEx</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>FormExの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{formExExample}</CodeBlock>
              </div>
              {formProps.button("none", {
                children: "コードをコピー",
                onClick: () => {
                  navigator.clipboard.writeText(formExExample);
                  actions.showInfo("コードをクリップボードにコピーしました");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>基本的なフォーム</TestDialogTitle>
            <TestDialogDescription>
              {formProps.input("name", {
                label: "名前",
                placeholder: "山田太郎",
                maxlength: 20,
                required: true,
              })}
              {formProps.input("email", {
                label: "メールアドレス",
                placeholder: "example@email.com",
                type: "email",
                required: true,
              })}
              {formProps.input("age", {
                label: "年齢",
                type: "number",
                min: 0,
                max: 120,
                required: true,
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>パスワードフォーム</TestDialogTitle>
            <TestDialogDescription>
              <form>
                {formProps.input("password", {
                  label: "パスワード",
                  type: "password",
                  required: true,
                })}
                {formProps.input("confirmPassword", {
                  label: "パスワード（確認）",
                  type: "password",
                  required: true,
                })}
                {formProps.checkbox("terms", {
                  label: "利用規約に同意する",
                  required: true,
                })}
                {formProps.button("submit", {
                  children: "送信",
                  onClick: () => {
                    if (form.password !== form.confirmPassword) {
                      actions.showError("confirmPassword", "パスワードが一致しません");
                      return;
                    }
                    log.info("send form", form);
                    actions.showInfo("フォームデータ: " + JSON.stringify(form, null, 2));
                  },
                })}
              </form>
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>フォームの状態確認</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "フォームの状態を確認",
                onClick: () => {
                  actions.showInfo(JSON.stringify(form, null, 2));
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}

export default Page;
