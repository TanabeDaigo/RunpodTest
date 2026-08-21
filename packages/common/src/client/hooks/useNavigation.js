/**
 * @file useNavigation.js
 * @description Next.jsのルーティング機能を拡張したカスタムフック
 *
 * このモジュールは、Next.jsのルーティング機能を
 * より使いやすく拡張したカスタムフックを提供します。
 *
 * 主な機能：
 * - ページ遷移の制御
 * - 履歴の操作
 * - ページのリフレッシュ
 * - デバッグログ機能
 *
 * @example
 * // 基本的な使用方法
 * const navigation = useNavigation();
 *
 * // ページ遷移
 * navigation.navigate('/users');
 *
 * // 履歴を置き換えて遷移
 * navigation.navigate('/login', { replace: true });
 *
 * // 前のページに戻る
 * navigation.goBack();
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";

import { useRouter } from "next/navigation";
import logjs from "@metrojs/logjs";

const log = new logjs("useNavigation");

/**
 * ナビゲーション用のカスタムフック
 *
 * @returns {Object} ナビゲーション関連の関数
 *
 * @example
 * const navigation = useNavigation();
 *
 * // ページ遷移
 * navigation.navigate('/users');
 *
 * // 履歴を置き換えて遷移
 * navigation.navigate('/login', { replace: true });
 *
 * // 前のページに戻る
 * navigation.goBack();
 *
 * // 次のページに進む
 * navigation.goForward();
 *
 * // ページをリフレッシュ
 * navigation.refresh();
 */
const useNavigation = () => {
  const router = useRouter();

  /**
   * 指定されたパスに遷移する
   *
   * @param {string} path - 遷移先のパス
   * @param {Object} [options] - 遷移オプション
   * @param {boolean} [options.replace=false] - 履歴を置き換えるかどうか
   *
   * @example
   * // 通常の遷移
   * navigate('/users');
   *
   * // 履歴を置き換えて遷移
   * navigate('/login', { replace: true });
   */
  const navigate = (path, options = {}) => {
    const { replace = false } = options;
    log.debug("ナビゲーション:", { path, options });

    // 数値のパスの場合の処理
    if (typeof path === "number") {
      if (path === -1) {
        router.back();
      } else if (path === 1) {
        router.forward();
      } else if (path === 0) {
        router.refresh();
      }
      return;
    }

    // 文字列のパスの場合の処理
    if (replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };

  /**
   * 前のページに戻る
   *
   * @example
   * // 前のページに戻る
   * goBack();
   */
  const goBack = () => {
    log.debug("前のページに戻ります");
    router.back();
  };

  /**
   * 次のページに進む
   *
   * @example
   * // 次のページに進む
   * goForward();
   */
  const goForward = () => {
    log.debug("次のページに進みます");
    router.forward();
  };

  /**
   * ページをリフレッシュする
   *
   * @example
   * // ページをリフレッシュ
   * refresh();
   */
  const refresh = () => {
    log.debug("ページをリフレッシュします");
    router.refresh();
  };

  return {
    navigate,
    goBack,
    goForward,
    refresh,
  };
};

export default useNavigation;
