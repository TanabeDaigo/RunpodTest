/**
 * ページネーション管理用のカスタムフック
 *
 * 以下の機能を提供:
 * - ページネーション状態の管理
 * - ページ変更ハンドラ
 * - ページサイズ変更ハンドラ
 * - ページネーションコンポーネント用のプロパティ生成
 *
 * @param {Function} onDataFetch - データ取得関数 (page, pageSize) => void
 * @param {Object} initialPagination - 初期ページネーション設定
 * @returns {[Object, Object]} ページネーション状態とハンドラを含むオブジェクトの配列
 */
"use client";
import { useState, useCallback } from "react";
import logjs from "@metrojs/logjs";

const log = new logjs("usePagination");

export const usePagination = (onDataFetch, initialPagination = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    ...initialPagination,
  });

  // ページネーション変更ハンドラ
  const handlePageChange = useCallback(
    newPage => {
      log.debug("handlePageChange", newPage);
      setPagination(prev => ({ ...prev, page: newPage }));
      onDataFetch(newPage, pagination.pageSize);
    },
    [onDataFetch, pagination.pageSize]
  );

  // ページサイズ変更ハンドラ
  const handlePageSizeChange = useCallback(
    newPageSize => {
      log.debug("handlePageSizeChange", newPageSize);
      setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
      onDataFetch(1, newPageSize); // ページサイズ変更時は最初のページに戻る
    },
    [onDataFetch]
  );

  // ページネーション状態の更新
  const updatePagination = useCallback(newPagination => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  // ページネーションコンポーネント用のプロパティ生成
  const makePaginationProps = useCallback(() => {
    const props = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: pagination.total,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    };
    //log.debug("makePaginationProps", props);
    return props;
  }, [pagination, handlePageChange, handlePageSizeChange]);

  return [
    pagination,
    {
      handlePageChange,
      handlePageSizeChange,
      updatePagination,
      makePaginationProps,
    },
  ];
};
