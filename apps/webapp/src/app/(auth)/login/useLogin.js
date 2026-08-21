"use client";
import { useState } from "react";

import { signIn } from "next-auth/react";

import { hooks } from "@lib/client";
import logjs from "@metrojs/logjs";
import Consts from "@common/config/consts";

const log = new logjs("login/useLogin");

export function useLogin() {
  //  const { data: session, status } = useSession();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, formProps] = hooks.useFormEx();

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);

      log.debug("ログイン処理開始", { form });

      const result = await signIn("credentials", {
        login_id: form.login_id,
        password: form.password,
        redirect: false,
        callbackUrl: Consts.ROUTES.HOME,
      });

      log.debug("ログイン結果", { result });

      if (result?.error) {
        // NextAuthのエラーメッセージを日本語に変換
        let errorMessage = "ログインに失敗しました";

        if (result.error === "CredentialsSignin") {
          errorMessage = "ログインIDまたはパスワードが正しくありません";
        } else if (result.error.includes("ログインIDまたはパスワードが正しくありません")) {
          errorMessage = result.error;
        }

        setError(errorMessage);
        return;
      }

      // ログイン成功時はリダイレクト
      if (result?.ok) {
        window.location.href = result.url || Consts.ROUTES.HOME;
      }
    } catch (error) {
      log.error("ログインエラー", error);
      setError("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return [
    {
      ...form,
      error,
      loading: isLoading,
    },
    {
      ...formProps,
      login,
    },
  ];
}
