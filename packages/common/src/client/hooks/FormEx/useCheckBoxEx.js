/**
 * @file useCheckBoxEx.js
 * @description フォーム用チェックボックスフィールドを簡単に生成するためのカスタムフック
 *
 * このフックは、Material-UIのコンポーネントを使用して、
 * スタイリッシュで機能的なフォームチェックボックスフィールドを提供します。
 * データベーススキーマのtinyint、boolean型カラムから自動生成されます。
 *
 * @example
 * // 基本的な使用例
 * const [form, formProps] = useFormEx();
 * const { checkbox_status, checkbox_is_deleted } = useCheckBoxEx(form, formProps);
 *
 * // コンポーネント内での使用
 * return (
 *   <form>
 *     {checkbox_status({ label: "ステータス" })}
 *     {checkbox_is_deleted({ label: "削除済み" })}
 *   </form>
 * );
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @since 2024-12-19
 */

"use client";

import logjs from "@metrojs/logjs";
const log = new logjs("useCheckBoxEx");

/**
 * チェックボックスフィールドを生成するためのカスタムフック
 * @param {Object} form - フォームデータオブジェクト
 * @param {Object} formProps - フォームプロパティオブジェクト
 * @returns {Object} 各種チェックボックスフィールド生成関数のオブジェクト
 */
const useCheckBoxEx = (form = {}, formProps = {}) => {
  const is_standard = true; // 標準のチェックボックスを使用するかどうか
  /**
   * 物理削除チェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 物理削除チェックボックスのJSX要素
   */
  const checkbox_is_deleted = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_is_deleted form.is_deleted:${form?.is_deleted || ""} params:`, params);
    return formProps.checkbox("is_deleted", { label: "物理削除", is_standard, ...params }, is_debug);
  };
  /**
   * tiny int型チェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} tiny int型チェックボックスのJSX要素
   */
  const checkbox_tinyint_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_tinyint_col form.tinyint_col:${form?.tinyint_col || ""} params:`, params);
    return formProps.checkbox("tinyint_col", { label: "tiny int型", is_standard, ...params }, is_debug);
  };
  /**
   * ステータス 1:削除済チェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ステータス 1:削除済チェックボックスのJSX要素
   */
  const checkbox_status = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_status form.status:${form?.status || ""} params:`, params);
    return formProps.checkbox("status", { label: "ステータス 1:削除済", is_standard, ...params }, is_debug);
  };
  /**
   * メールアドレス１送信フラグチェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス１送信フラグチェックボックスのJSX要素
   */
  const checkbox_is_send_mail1 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_is_send_mail1 form.is_send_mail1:${form?.is_send_mail1 || ""} params:`, params);
    return formProps.checkbox("is_send_mail1", { label: "メールアドレス１送信フラグ", is_standard, ...params }, is_debug);
  };
  /**
   * メールアドレス２送信フラグチェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス２送信フラグチェックボックスのJSX要素
   */
  const checkbox_is_send_mail2 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_is_send_mail2 form.is_send_mail2:${form?.is_send_mail2 || ""} params:`, params);
    return formProps.checkbox("is_send_mail2", { label: "メールアドレス２送信フラグ", is_standard, ...params }, is_debug);
  };
  /**
   * メールアドレス３送信フラグチェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス３送信フラグチェックボックスのJSX要素
   */
  const checkbox_is_send_mail3 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_is_send_mail3 form.is_send_mail3:${form?.is_send_mail3 || ""} params:`, params);
    return formProps.checkbox("is_send_mail3", { label: "メールアドレス３送信フラグ", is_standard, ...params }, is_debug);
  };
  /**
   * 性別 0:男性,1:女性チェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 性別 0:男性,1:女性チェックボックスのJSX要素
   */
  const checkbox_sex = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_sex form.sex:${form?.sex || ""} params:`, params);
    return formProps.checkbox("sex", { label: "性別 0:男性,1:女性", is_standard, ...params }, is_debug);
  };
  /**
   * 都道府県IDチェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 都道府県IDチェックボックスのJSX要素
   */
  const checkbox_province_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_province_id form.province_id:${form?.province_id || ""} params:`, params);
    return formProps.checkbox("province_id", { label: "都道府県ID", is_standard, ...params }, is_debug);
  };
  /**
   * 喫煙フラグ true:禁煙 false:喫煙チェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 喫煙フラグ true:禁煙 false:喫煙チェックボックスのJSX要素
   */
  const checkbox_is_smoking = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_is_smoking form.is_smoking:${form?.is_smoking || ""} params:`, params);
    return formProps.checkbox("is_smoking", { label: "喫煙フラグ true:禁煙 false:喫煙", is_standard, ...params }, is_debug);
  };
  /**
   * 血液型 A:1, O:2, B:3, AB:4チェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 血液型 A:1, O:2, B:3, AB:4チェックボックスのJSX要素
   */
  const checkbox_blood_type = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_blood_type form.blood_type:${form?.blood_type || ""} params:`, params);
    return formProps.checkbox("blood_type", { label: "血液型 A:1, O:2, B:3, AB:4", is_standard, ...params }, is_debug);
  };
  /**
   * 配偶者有無チェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 配偶者有無チェックボックスのJSX要素
   */
  const checkbox_is_spouse = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_is_spouse form.is_spouse:${form?.is_spouse || ""} params:`, params);
    return formProps.checkbox("is_spouse", { label: "配偶者有無", is_standard, ...params }, is_debug);
  };
  /**
   * ユーザー権限チェックボックス
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ユーザー権限チェックボックスのJSX要素
   */
  const checkbox_auth = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`checkbox_auth form.auth:${form?.auth || ""} params:`, params);
    return formProps.checkbox("auth", { label: "ユーザー権限", is_standard, ...params }, is_debug);
  };

  return {
    checkbox_is_deleted,
    checkbox_tinyint_col,
    checkbox_status,
    checkbox_is_send_mail1,
    checkbox_is_send_mail2,
    checkbox_is_send_mail3,
    checkbox_sex,
    checkbox_province_id,
    checkbox_is_smoking,
    checkbox_blood_type,
    checkbox_is_spouse,
    checkbox_auth,
  };
};

export default useCheckBoxEx;
