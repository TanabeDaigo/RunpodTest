/**
 * @file useRadioEx.js
 * @description フォーム用ラジオボタンフィールドを簡単に生成するためのカスタムフック
 *
 * このフックは、Material-UIのRadioコンポーネントを使用して、
 * スタイリッシュで機能的なフォームラジオボタンフィールドを提供します。
 * データベーススキーマの性別・権限関連カラムから自動生成されます。
 *
 * @example
 * // 基本的な使用例
 * const [form, formProps] = useFormEx();
 * const { radio_sex, radio_auth } = useRadioEx(form, formProps);
 *
 * // コンポーネント内での使用
 * return (
 *   <form>
 *     {radio_sex({ label: "性別" })}
 *     {radio_auth({ label: "ユーザー権限" })}
 *   </form>
 * );
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @since 2024-12-19
 */

"use client";

import logjs from "@metrojs/logjs";

const log = new logjs("useRadioEx");

/**
 * ラジオボタンフィールドを生成するためのカスタムフック
 * @param {Object} form - フォームデータオブジェクト
 * @param {Object} formProps - フォームプロパティオブジェクト
 * @param {Object} state - 状態オブジェクト
 * @param {Object} actions - アクションオブジェクト
 * @returns {Object} 各種ラジオボタンフィールド生成関数のオブジェクト
 */
const useRadioEx = (form = {}, formProps = {}, state = {}, actions = {}) => {
  const is_standard = true; // 標準のラジオボタンを使用するかどうか
  /**
   * 性別 0:男性,1:女性ラジオボタンを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 性別 0:男性,1:女性ラジオボタンのJSX要素
   */
  const radio_sex = (params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(`radio_sex form.sex:${form?.sex || ""} params:`, params);
      log.debug(`radio_sex state.initData.sex:`, state.initData?.sex);
    }

    const options = [
      {
        key: 1,
        value: 1,
        label: "オプション1",
      },
      {
        key: 2,
        value: 2,
        label: "オプション2",
      },
    ];

    return formProps.radio(
      "sex",
      {
        label: "性別 0:男性,1:女性",
        options: options,
        ...params,
      },
      is_debug
    );
  };
  /**
   * ユーザー権限ラジオボタンを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ユーザー権限ラジオボタンのJSX要素
   */
  const radio_auth = (params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(`radio_auth form.auth:${form?.auth || ""} params:`, params);
      log.debug(`radio_auth state.initData.auth:`, state.initData?.auth);
    }

    const options = [
      {
        key: 1,
        value: 1,
        label: "オプション1",
      },
      {
        key: 2,
        value: 2,
        label: "オプション2",
      },
    ];

    return formProps.radio(
      "auth",
      {
        label: "ユーザー権限",
        options: options,
        ...params,
      },
      is_debug
    );
  };

  return {
    radio_sex,
    radio_auth,
  };
};

export default useRadioEx;
