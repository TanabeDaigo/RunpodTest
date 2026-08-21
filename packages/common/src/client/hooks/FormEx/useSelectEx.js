/**
 * @file useSelectEx.js
 * @description フォーム選択フィールドを簡単に生成するためのカスタムフック
 *
 * @example
 * // 基本的な使用例
 * const [form, formProps] = useFormEx();
 * const { select_dbms } = useSelectEx(form, formProps);
 *
 * // コンポーネント内での使用
 * return (
 *   <form>
 *     {select_dbms({
 *       name: "dbms",
 *       label: "DBMS",
 *       required: true
 *     })}
 *   </form>
 * );
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @since 2024-03-01
 */

"use client";

import logjs from "@metrojs/logjs";

const log = new logjs("useSelectEx");

const useSelectEx = (form = {}, formProps = {}, state = {}, actions = {}) => {
  const is_standard = true; // 標準のセレクトを使用するかどうか

  const select_shiten_code = (params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(`select_shiten_code params:`, params);
      log.debug(`state:`, state);
    }

    const shiten_info = state.initData?.shiten_info;
    if (!shiten_info) {
      return null;
    }
    const options = shiten_info.map((item) => ({
      key: item.shiten_code,
      value: item.shiten_code,
      label: item.shiten_code + ":" + item.shiten_name,
    }));

    return formProps.select(
      "shiten_code",
      {
        label: "支店",
        options: options,
        is_standard,
        ...params,
      },
      is_debug
    );
  };

  const selectMulti_shiten_code = (params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(`select_shiten_code params:`, params);
    }

    const shiten_info = state.initData?.shiten_info;
    if (!shiten_info) {
      return null;
    }
    const options = shiten_info.map((item) => ({
      key: item.shiten_code,
      value: item.shiten_code,
      label: item.shiten_name,
    }));

    return formProps.selectMulti(
      "shiten_code",
      {
        label: "支店",
        options: options,
        is_standard,
        ...params,
      },
      is_debug
    );
  };

  const select_auth = (params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(`select_auth params:`, params);
    }

    const options = [
      { key: 7, value: 7, label: "管理者" },
      { key: 0, value: 0, label: "一般" },
    ];

    return formProps.select(
      "auth",
      {
        label: "ユーザー権限",
        options,
        is_standard,
        ...params,
      },
      is_debug
    );
  };

  const select_auth_all = (params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(`select_auth params:`, params);
    }

    const options = [
      { key: 9, value: 9, label: "開発者" },
      { key: 8, value: 8, label: "システム管理者" },
      { key: 7, value: 7, label: "管理者" },
      { key: 0, value: 0, label: "一般" },
    ];

    return formProps.select(
      "auth",
      {
        label: "ユーザー権限",
        options,
        is_standard,
        ...params,
      },
      is_debug
    );
  };

  return {
    select_shiten_code,
    selectMulti_shiten_code,
    select_auth,
    select_auth_all,
  };
};

export default useSelectEx;
