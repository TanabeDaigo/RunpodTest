"use client";

// 必要なライブラリとコンポーネントをインポート
import { hooks, apijs, logjs } from "@lib/client";
import EditDialog from "./EditDialog";

// ログ出力用のインスタンスを作成
const log = new logjs("useEditDialog");

// プロジェクトAPIのインスタンスを作成
const api = new apijs("api/Projects");
// カスタムダイアログフックを取得
const { useCustomDialog } = hooks;

/**
 * プロジェクト編集ダイアログのカスタムフック
 * プロジェクトの新規作成・編集・削除機能を提供する
 * @param {Object} state - アプリケーションの状態
 * @param {Object} actions - アクション関数群（showLoading, hideLoading等）
 * @param {Object} params - パラメータ（project_id, is_new等）
 * @returns {Array} [formData, dialogControls] - フォームデータとダイアログ制御関数
 */
export const useEditDialog = (state, actions, params) => {
  // カスタムダイアログの制御関数を取得
  const { open, onClose, isOpen, renderDialog } = useCustomDialog(EditDialog);

  // パラメータからプロジェクトIDと新規作成フラグを取得
  log.debug("useEditDialog params", params);

  const initForm = {
    dbms_id: 1, // デフォルトのDBMS ID
    project_name: "", // プロジェクト名（空文字）
  };
  // フォームの状態とプロパティを管理するフック
  const [form, formProps] = hooks.useFormEx(
    initForm,
    state, // アプリケーション状態
    actions // アクション関数群
  );

  /**
   * プロジェクトの1件取得処理
   * 既存プロジェクトの編集時に呼び出される
   * @returns {Promise} APIレスポンス
   */
  const get_one = async () => {
    const project_id = params?.project_id || null;
    log.debug(`get_one project_id:${project_id}`);
    // ローディング表示を開始
    actions.showLoading();
    try {
      // APIにプロジェクト取得リクエストを送信
      const res = await api.post({ mode: "get_one", project_id: project_id });
      log.debug("get_one res", res);
      if (res.result) {
        // 取得したデータをフォームに設定
        formProps.setForm({ ...res.data });
      }
      return res;
    } catch (error) {
      log.error("get_one error", error);
      return { error: error.message, result: false };
    } finally {
      // ローディング表示を終了
      actions.hideLoading();
    }
  };

  /**
   * プロジェクトの保存処理
   * 新規作成の場合は"save"、更新の場合は"update"モードでAPIを呼び出し
   * @returns {Promise} APIレスポンス
   */
  const save = async () => {
    const project_id = params?.project_id || null;
    const is_new = params.is_new;

    // ローディング表示を開始
    actions.showLoading();
    try {
      log.debug(`save project_id:${project_id} is_new:${is_new}`, params);
      // APIに送信するパラメータを構築
      const _params = {
        mode: is_new == true ? "save" : "update", // 新規作成か更新かを判定
        ...form, // フォームの値を展開
      };
      // 更新の場合はproject_idを追加
      if (is_new == false) {
        _params.project_id = project_id;
      }
      log.debug("save _params", _params);
      // APIにPOSTリクエストを送信
      const res = await api.post(_params);
      log.debug("save res", res);
      return res;
    } catch (error) {
      log.error("save error", error);
      return { error: error.message, result: false };
    } finally {
      // ローディング表示を終了
      actions.hideLoading();
    }
  };

  /**
   * プロジェクトの削除処理
   * 既存プロジェクトを削除する
   * @returns {Promise} APIレスポンス
   */
  const delete_one = async () => {
    // ローディング表示を開始
    actions.showLoading();
    try {
      const project_id = params?.project_id || null;
      // APIに削除リクエストを送信
      const res = await api.post({ mode: "delete", project_id: project_id });
      return res;
    } catch (error) {
      log.error("delete_one error", error);
      return { error: error.message, result: false };
    } finally {
      // ローディング表示を終了
      actions.hideLoading();
    }
  };

  // フックの戻り値：フォームデータとダイアログ制御関数
  return [
    { ...form }, // フォームの状態データ
    {
      ...formProps, // フォームのプロパティ（onChange等）
      isOpen, // ダイアログの開閉状態
      renderDialog, // ダイアログのレンダリング関数
      open, // ダイアログを開く関数
      onClose, // ダイアログを閉じる関数
      save, // 保存処理関数
      get_one, // 1件取得処理関数
      delete_one, // 1件削除処理関数
    },
  ];
};
