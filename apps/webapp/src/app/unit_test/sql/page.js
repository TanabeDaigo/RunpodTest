"use client";

import { providers } from "@lib/client";
const { useWebAppContext } = providers;
import { logjs } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, TestDialogHeader, TestDialogMainTitle, CodeBlock } from "../styles";
import { useUnitTest } from "../useUnitTest";

const log = new logjs("TestSql");
const sqlExample = `
  SELECT * FROM users;
`;

export default function Page() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};

  const [form, formProps] = useUnitTest({}, state, actions);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sqlExample);
    actions.showSnackbar("コードをクリップボードにコピーしました", "success");
  };

  return (
    <div>
      <TestDialogHeader>
        <TestDialogMainTitle>Unit Test Sql</TestDialogMainTitle>
      </TestDialogHeader>
      <div>
        <TestDialogGrid>
          <TestDialogCard>
            <TestDialogTitle>dbjs,sqljsの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{sqlExample}</CodeBlock>
              </div>
              {formProps.button("none", {
                children: "コードをコピー",
                onClick: () => {
                  navigator.clipboard.writeText(sqlExample);
                  actions.showAlert("成功", "コードをクリップボードにコピーしました");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>

          <TestDialogCard>
            <TestDialogTitle>dbjs,sqljsのテスト</TestDialogTitle>
            <TestDialogDescription>
              {formProps.button("none", {
                children: "dbjs,sqljsのテスト",
                onClick: () => {
                  formProps.executeApi();
                },
              })}
            </TestDialogDescription>

            <TestDialogTitle>プログラムの使用例</TestDialogTitle>
            <TestDialogDescription>
              <div style={{ marginBottom: "1rem" }}>
                <CodeBlock>{sqlExample}</CodeBlock>
              </div>
              {formProps.button("none", {
                children: "コードをコピー",
                onClick: () => {
                  navigator.clipboard.writeText(inputExample);
                  actions.showAlert("成功", "コードをクリップボードにコピーしました");
                },
              })}
            </TestDialogDescription>
          </TestDialogCard>
        </TestDialogGrid>
      </div>
    </div>
  );
}
