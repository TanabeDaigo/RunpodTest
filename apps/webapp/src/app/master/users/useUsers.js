/**
 * ユーザー管理用のカスタムフック
 *
 * 以下の機能を提供:
 * - フォーム状態の管理
 * - ルーティング制御
 * - ユーザーデータの操作
 *
 * @returns {[Object, Object]} フォーム状態とフォームプロパティを含むオブジェクトの配列
 * @author kronometro
 * @copyright (c) 2024 kronometro
 */
"use client";
import { useState } from "react";

import { apijs, hooks, logjs, components } from "@lib/client";

import { userColumns } from "./columns";

// APIクライアントとログインスタンスの初期化
const api = new apijs("api/Users");
const log = new logjs("useUsers");

/**
 * ユーザー管理用のカスタムフック
 * @param {Object} initState - フォームの初期状態
 * @param {Object} state - 現在の状態
 * @param {Object} actions - アクション関数
 * @returns {[Object, Object]} フォーム状態とフォームプロパティを含むオブジェクトの配列
 */
export const useUsers = (initState, state, actions) => {
  // フォーム状態の管理
  const [form, formProps] = hooks.useFormEx(initState, state, actions);

  // ソート情報の状態管理（デフォルト: user_idの降順）
  const [sortInfo, setSortInfo] = useState({ sortKey: "user_id", sortOrder: "desc" });

  // ページネーションフックを使用
  const [pagination, paginationProps] = hooks.usePagination(find);

  // ユーザーデータの状態管理
  const [users, setUsers] = useState([]);

  /**
   * ユーザーデータを検索・取得する
   * @param {number} page - ページ番号（デフォルト: 1）
   * @param {number} pageSize - 1ページあたりの表示件数（デフォルト: 10）
   * @param {Object} formData - 検索条件（デフォルト: 現在のフォーム状態）
   * @param {Object} _sortInfo - ソート情報（デフォルト: 現在のソート状態）
   */
  async function find(page = 1, pageSize = 10, formData = null, _sortInfo = null) {
    log.debug("useUsers find", page, pageSize, formData, _sortInfo);

    // 検索条件とソート情報の設定
    const findForm = formData || form;
    const sort = _sortInfo || sortInfo;
    try {
      actions.showLoading();
      // APIリクエストの実行
      const res = await api.post({
        mode: "find",
        ...findForm,
        page,
        pageSize,
        sortKey: sort.sortKey,
        sortOrder: sort.sortOrder,
      });
      log.debug("useUsers find res", res);

      if (res.data) {
        const responseData = res.data;

        // ページネーション情報付きのデータの場合
        if (responseData.rows) {
          setUsers(responseData.rows);
          paginationProps.updatePagination({
            page: responseData.page || page,
            pageSize: responseData.pageSize || pageSize,
            total: responseData.total || 0,
          });
        } else {
          // 通常の配列データの場合
          setUsers(responseData);
          paginationProps.updatePagination({
            page,
            pageSize,
            total: responseData.length || 0,
          });
        }
      }
    } catch (error) {
      log.error("useUsers find error", error);
      return { error: error.message, result: false };
    } finally {
      actions.hideLoading();
    }
  }

  /**
   * フォームを初期状態にリセットし、検索を再実行する
   */
  const reset = async () => {
    formProps.setForm(initState);
    // リセット後に自動的に検索を実行
    await find(pagination.page, pagination.pageSize, initState, sortInfo);
  };

  /**
   * テーブルヘッダーがクリックされた時のソート処理
   * @param {Object} column - クリックされた列の情報
   */
  const onHeaderClick = (column) => {
    // 同じカラムがクリックされた場合はソート順を切り替え
    const newOrder = sortInfo.sortKey === column.dataKey && sortInfo.sortOrder === "desc" ? "asc" : "desc";
    setSortInfo({ sortKey: column.dataKey, sortOrder: newOrder });
    // 新しいソート条件で検索実行
    find(pagination.page, pagination.pageSize, form, { sortKey: column.dataKey, sortOrder: newOrder });
  };

  /**
   * 仮想化テーブルの設定と生成
   * @param {Object} params - テーブル設定パラメータ
   * @param {Array} params.columns - 列の定義
   * @param {Function} params.onShowTableRow - 行表示時のコールバック
   * @returns {Object} 仮想化テーブルコンポーネント
   */
  const makeGrid = (params = {}) => {
    const { onShowTableRow } = {
      ...params,
    };
    return components.VirtualizedTable({
      rowHeightRatio: 0.1, // 行の高さの倍率（例: 0.1 = テーブル全体の10%の高さを各行に割り当てる）
      tableHeight: 500, // テーブル全体の高さ
      selectRowIndex: 0, // 高さを変更したい選択行（selectRowHeightで変更値を設定）
      selectRowHeight: 50, // 選択行の高さ
      sortInfo: sortInfo, // ソート情報
      data: users, // 表示するデータ配列
      columns: userColumns, // 列の定義
      onHeaderClick,
      onShowTableRow,
    });
  };

  // フォーム状態とフォームプロパティを返す
  return [
    {
      ...form,
    },
    {
      ...formProps,
      find,
      reset,
      makeGrid,
      makePagination: paginationProps.makePaginationProps,
    },
  ];
};
