/**
 * ⚡️ KronoMetro WebApp Provider
 *
 * エレガントでモダンなWebアプリケーションプロバイダーコンポーネント
 * 認証、ナビゲーション、レイアウト制御を統合的に管理します
 *
 * 主な機能:
 * - 認証状態に応じたルーティング制御
 * - レスポンシブなダッシュボードレイアウト
 * - スタイリッシュなUI/UXの提供
 * - ダイアログ、スナックバー等の統合管理
 *
 * @module WebAppProvider
 * @description メインプロバイダーコンポーネント
 * @copyright © 2024-present KronoMetro, Co.
 */

"use client";

import * as React from "react";
import { Suspense, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { createTheme } from "@mui/material/styles";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { SnackbarProvider } from "notistack";

import Consts from "@common/config/consts";

import { components } from "@krono-metro/metrojs/client";

const { Loading } = components;
// Providers
import { NextAppProvider } from "@toolpad/core/nextjs";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { DialogsProvider } from "@toolpad/core/useDialogs";
import { NotificationsProvider } from "@toolpad/core/useNotifications";

import logjs from "@metrojs/logjs";
const log = new logjs("WebAppProvider");

import { AppTitle, ToolbarActions, LogoutButton, SidebarFooter, FooterText, FooterCopyright } from "./styles";
import { useSnackbarEx } from "../hooks/useSnackbarEx";
import { useConfirmEx } from "../hooks/useConfirmEx";
import { useAlertEx } from "../hooks/useAlertEx";

/**
 * アプリケーションのテーマ設定
 * Material-UIのテーマをカスタマイズし、レスポンシブなブレークポイントを定義
 */
const appTheme = createTheme({
  colorSchemes: { light: true, dark: false },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

/**
 * スナックバーの種類を定義する定数
 * アプリケーション全体で使用する通知の種類を定義
 * @constant
 * @type {Object}
 */
export const SNACKBAR_SEVERITY = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

// 認証関連の定数定義
const AUTH_PAGES = ["/login", "/register", "/forgot-password"];

// 認証不要のページを判定する関数
const isPublicPage = (pathname) => {
  return AUTH_PAGES.includes(pathname);
};

// コンテキストの作成
export const WebAppContext = React.createContext(null);

// コンテキストを使用するためのフック
export function useWebAppContext() {
  const context = React.useContext(WebAppContext);
  if (!context) {
    throw new Error("useWebAppContext must be used within a WebAppProvider");
  }
  return context;
}

/**
 * WebAppProviderの内部コンポーネント
 * レイアウトのメインロジックを管理し、認証状態に応じたルーティングを制御
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Function} props.window - windowオブジェクトを提供する関数
 * @param {React.ReactNode} props.children - 子要素
 * @param {Function} props.navigation - ナビゲーションアイテムを生成する関数
 * @param {any} props.initData - 初期データ
 * @param {boolean} props.isInitDataLoading - 初期データのローディング状態

 */
function WebAppProviderInner(props) {
  const { window, children, navigation, initData, isInitDataLoading, onInitDataFetch } = props;
  const nextRouter = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession({ required: false });
  const appWindow = window ? window() : undefined;
  const searchParams = useSearchParams();
  const params = React.useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  // 各種フックの初期化
  const [isLoading, setIsLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState("");

  const { showError, showWarning, showInfo, showSuccess } = useSnackbarEx();
  const { showConfirm } = useConfirmEx();
  const { showAlert } = useAlertEx();
  // 追加: 即時未認証化のためのフラグ
  // と user 参照
  const [forceLogout, setForceLogout] = useState(false);
  const user = forceLogout ? null : session?.user;

  // 現在のページ状態を判定
  const isPublic = isPublicPage(pathname);

  // ルーター設定のメモ化
  const router = React.useMemo(
    () => ({
      pathname: pathname || "/",
      searchParams, // 実値をそのまま渡す
      navigate: (path) => {
        nextRouter.push(path);
      },
    }),
    [pathname, nextRouter, searchParams]
  );

  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  // ナビゲーション処理
  const [isPending, startTransition] = React.useTransition();
  const handleNavigation = (path) => {
    showLoading();
    startTransition(() => {
      nextRouter.push(path);
    });
  };
  React.useEffect(() => {
    if (!isPending) hideLoading();
  }, [isPending, hideLoading]);

  const stableActions = React.useMemo(
    () => ({
      setPageTitle,
      showLoading,
      hideLoading,
      showError,
      showWarning,
      showInfo,
      showSuccess,
      showConfirm: showConfirm,
      showAlert: showAlert,
      onInitDataFetch: onInitDataFetch,
    }),
    [setPageTitle, showLoading, hideLoading, showError, showWarning, showInfo, showSuccess, showConfirm, showAlert, onInitDataFetch]
  );

  // コンテキストの値を準備
  const contextValue = React.useMemo(() => {
    return {
      params,
      state: {
        user: user,
        initData,
        isInitDataLoading,
        pageTitle: pageTitle,
        isLoading: isLoading,
      },
      actions: stableActions,
    };
  }, [params, user, initData, isInitDataLoading, pageTitle, isLoading, stableActions]);

  // ナビゲーションアイテムの取得
  const navigationItems = navigation({ contextValue, handleNavigation });

  // 認証状態に基づくリダイレクト制御
  React.useEffect(() => {
    if (status === "loading") return;

    const run = async () => {
      if (status === "unauthenticated" && isPublic) return;
      if (user) {
        if (isPublic && pathname !== "/") {
          await nextRouter.replace(Consts.ROUTES.HOME);
        }
      } else {
        if (!isPublic) {
          await nextRouter.replace("/login");
        }
      }
    };
    run();
  }, [user, status, isPublic, pathname, nextRouter]);

  // ログアウト処理
  const handleLogout = async () => {
    try {
      showLoading();
      setForceLogout(true);
      const result = await signOut({ redirect: false, callbackUrl: "/login" });
      nextRouter.replace(result?.url || "/login");
    } catch {
      showError("ログアウトに失敗しました");
      nextRouter.replace("/login");
    } finally {
      hideLoading();
    }
  };

  // 認証中の表示制御
  if (status === "loading") {
    log.debug("Loading - 認証中です");
    return <Loading show={true} />;
  }

  // 認証ページの表示制御
  if (isPublic) {
    if (!children) {
      return <Loading show={true} />;
    }
    return <WebAppContext.Provider value={contextValue}>{children}</WebAppContext.Provider>;
  }

  // 未認証時の表示制御
  if (!user && !isPublic) {
    log.debug("Loading - 未認証ユーザーがアクセスしました");
    return <Loading show={true} />;
  }

  // メインレイアウトの描画
  //
  return (
    <WebAppContext.Provider value={contextValue}>
      {isLoading && <Loading show={isLoading} />}
      <NextAppProvider navigation={navigationItems} router={router} theme={appTheme} window={appWindow}>
        <DashboardLayout
          title="MetroJS"
          slots={{
            appTitle: () => <AppTitle>{pageTitle}</AppTitle>,

            breadcrumbs: () => null,
            // ページタイトルを非表示にする
            pageTitle: () => null,
            toolbarActions: () => (
              <ToolbarActions>
                <LogoutButton onClick={handleLogout}>ログアウト</LogoutButton>
              </ToolbarActions>
            ),
            sidebarFooter: () => (
              <SidebarFooter>
                <FooterText>{Consts.APP_NAME}</FooterText>
                <FooterCopyright>© 2025 All Rights Reserved</FooterCopyright>
              </SidebarFooter>
            ),
          }}
        >
          <PageContainer
            //breadcrumbs={[]} // パンくず を非表示にする
            slotProps={{
              // タイトル を非表示にする
              header: {
                title: "",
              },
            }}
          >
            {children}
          </PageContainer>
        </DashboardLayout>
      </NextAppProvider>
    </WebAppContext.Provider>
  );
}

/**
 * WebAppProviderコンポーネント
 * アプリケーション全体のプロバイダーを統合し、認証状態を管理
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Function} props.window - windowオブジェクトを提供する関数
 * @param {React.ReactNode} props.children - 子要素
 * @param {Function} props.navigation - ナビゲーションアイテムを生成する関数
 * @param {any} props.initData - 初期データ
 * @param {boolean} props.isInitDataLoading - 初期データのローディング状態
 * @param {Function} props.onInitDataFetch - 初期データの取得関数
 */
function WebAppProvider(props) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true} refetchWhenOffline={false}>
      <DialogsProvider>
        <SnackbarProvider>
          <NotificationsProvider>
            <Suspense fallback={<Loading show={true} />}>
              <WebAppProviderInner {...props} />
            </Suspense>
          </NotificationsProvider>
        </SnackbarProvider>
      </DialogsProvider>
    </SessionProvider>
  );
}

// PropTypes 定義（開発時の props 検証用）
WebAppProviderInner.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node,
  navigation: PropTypes.func.isRequired,
  initData: PropTypes.any,
  isInitDataLoading: PropTypes.bool,
  onInitDataFetch: PropTypes.func,
};

WebAppProvider.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node,
  navigation: PropTypes.func.isRequired,
  initData: PropTypes.any,
  isInitDataLoading: PropTypes.bool,
  onInitDataFetch: PropTypes.func,
};

export default WebAppProvider;
