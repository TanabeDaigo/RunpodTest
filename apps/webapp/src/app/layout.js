"use client";
/**
 * AppRouterCacheProviderNext.js が .html ページのチャンクをクライアントにストリーミングしているため、
 * このコンポーネントはサーバー上の MUI システムによって生成された CSS を収集する役割を担っています。
 * コンポーネントの使用は必須ではありませんがAppRouterCacheProvider、スタイルが に追加され<head>、 で
 * レンダリングされないようにするために、コンポーネントの使用をお勧めします。
 * なぜそれが優れているかについては、 https://github.com/mui/material-ui/issues/26561#issuecomment-855286153<を参照してください。
 */

import * as React from "react";
// Google Fontsのインポートを削除
import theme from "./muiTheme";
import "@common/styles/globals.css";

import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";

//import { SessionProvider } from "next-auth/react";
import { providers } from "@lib/client";
import { apijs } from "@metrojs/client";
import logjs from "@metrojs/logjs";

import Navigation from "./navigation.js";

const { WebAppProvider } = providers;
const log = new logjs("layout");

const api = new apijs("api/Common");

// robotoフォントの設定を削除

function Providers({ children }) {
  const [initData, setInitData] = React.useState(null);
  const [isInitDataLoading, setIsInitDataLoading] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  // ハイドレーションを制御
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // useCallbackでメモ化
  const fetchInitData = React.useCallback(async () => {
    try {
      setIsInitDataLoading(true);
      log.debug("fetchInitData - 初期データ取得開始");

      // セッション状態の確認
      let sessionData = null;
      try {
        const sessionResponse = await fetch("/api/auth/session");
        sessionData = await sessionResponse.json();
        log.debug("fetchInitData - セッション状態", {
          hasSession: !!sessionData,
          sessionData: sessionData,
        });
      } catch (sessionError) {
        log.warn("fetchInitData - セッション確認エラー", sessionError);
      }

      log.debug("fetchInitData - sessionData", sessionData);
      if (sessionData == null) {
        return;
      }

      // API呼び出し前の状態確認
      log.debug("fetchInitData - API呼び出し前の状態", {
        apiUrl: api.baseURL || "api/Common",
        mode: "get_init_data",
      });

      const result = await api.post({ mode: "get_init_data" });
      log.debug("fetchInitData - 初期データ取得成功", result);

      // エラーが含まれている場合の処理
      if (result && result.error) {
        log.warn("fetchInitData - サーバーからエラーが返されました", result.error);
        log.warn("fetchInitData - エラー詳細", {
          error: result.error,
          controller: result.controller,
          timestamp: result.timestamp,
        });
        setInitData({
          shiten_info: [],
          error: result.error,
          controller: result.controller,
          timestamp: result.timestamp,
        });
      } else {
        setInitData(result);
      }
    } catch (error) {
      log.error("fetchInitData - 初期データの取得エラー", error);
      log.error("fetchInitData - エラー詳細", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        response: error.response,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      // レスポンスからエラー情報を取得
      let errorMessage = error.message;
      let errorDetails = {};

      if (error.response) {
        try {
          const errorData = await error.response.json();
          errorMessage = errorData.error || error.message;
          errorDetails = {
            controller: errorData.controller,
            timestamp: errorData.timestamp,
            status: error.response.status,
            statusText: error.response.statusText,
          };
          log.error("fetchInitData - サーバーエラーレスポンス", errorData);
        } catch (parseError) {
          log.warn("fetchInitData - エラーレスポンスの解析に失敗", parseError);
          log.warn("fetchInitData - 生のレスポンス", {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: Object.fromEntries(error.response.headers.entries()),
          });
        }
      } else {
        log.error("fetchInitData - ネットワークエラーまたはタイムアウト");
      }

      setInitData({
        shiten_info: [],
        error: errorMessage,
        ...errorDetails,
      });
    } finally {
      setIsInitDataLoading(false);
    }
  }, []);

  //log.debug("------------- initData", initData);
  // 初期データの取得
  React.useEffect(() => {
    if (initData == null && isMounted) {
      fetchInitData();
    }
  }, [initData, isMounted]);

  // ハイドレーション中は何も表示しない
  if (!isMounted) {
    return null;
  }

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: false }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WebAppProvider
          navigation={Navigation}
          initData={initData}
          isInitDataLoading={isInitDataLoading}
          onInitDataFetch={fetchInitData}
        >
          {children}
        </WebAppProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
