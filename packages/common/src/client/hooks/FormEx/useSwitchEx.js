/**
 * @file useSwitchEx.js
 * @description フォーム用スイッチフィールドを簡単に生成するためのカスタムフック
 *
 * このフックは、Material-UIのSwitchコンポーネントを使用して、
 * スタイリッシュで機能的なフォームスイッチフィールドを提供します。
 * データベーススキーマのboolean、tinyint型カラムから自動生成されます。
 *
 * @example
 * // 基本的な使用例
 * const [form, formProps] = useFormEx();
 * const { switch_status, switch_is_deleted } = useSwitchEx(form, formProps);
 *
 * // コンポーネント内での使用
 * return (
 *   <form>
 *     {switch_status({ label: "ステータス" })}
 *     {switch_is_deleted({ label: "削除済み" })}
 *   </form>
 * );
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @since 2024-12-19
 */

"use client";

import logjs from "@metrojs/logjs";
const log = new logjs("useSwitchEx");

/**
 * スイッチフィールドを生成するためのカスタムフック
 * @param {Object} form - フォームデータオブジェクト
 * @param {Object} formProps - フォームプロパティオブジェクト
 * @returns {Object} 各種スイッチフィールド生成関数のオブジェクト
 */
const useSwitchEx = (form = {}, formProps = {}) => {
  /**
   * 物理削除スイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 物理削除スイッチのJSX要素
   */
  const switch_is_deleted = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_is_deleted form.is_deleted:${form?.is_deleted || ""} params:`, params);
    return formProps.toggleSwitch("is_deleted", { label: "物理削除", ...params }, is_debug);
  };
  /**
   * tiny int型スイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} tiny int型スイッチのJSX要素
   */
  const switch_tinyint_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_tinyint_col form.tinyint_col:${form?.tinyint_col || ""} params:`, params);
    return formProps.toggleSwitch("tinyint_col", { label: "tiny int型", ...params }, is_debug);
  };
  /**
   * ステータス 1:削除済スイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ステータス 1:削除済スイッチのJSX要素
   */
  const switch_status = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_status form.status:${form?.status || ""} params:`, params);
    return formProps.toggleSwitch("status", { label: "ステータス 1:削除済", ...params }, is_debug);
  };
  /**
   * メールアドレス１送信フラグスイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス１送信フラグスイッチのJSX要素
   */
  const switch_is_send_mail1 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_is_send_mail1 form.is_send_mail1:${form?.is_send_mail1 || ""} params:`, params);
    return formProps.toggleSwitch("is_send_mail1", { label: "メールアドレス１送信フラグ", ...params }, is_debug);
  };
  /**
   * メールアドレス２送信フラグスイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス２送信フラグスイッチのJSX要素
   */
  const switch_is_send_mail2 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_is_send_mail2 form.is_send_mail2:${form?.is_send_mail2 || ""} params:`, params);
    return formProps.toggleSwitch("is_send_mail2", { label: "メールアドレス２送信フラグ", ...params }, is_debug);
  };
  /**
   * メールアドレス３送信フラグスイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス３送信フラグスイッチのJSX要素
   */
  const switch_is_send_mail3 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_is_send_mail3 form.is_send_mail3:${form?.is_send_mail3 || ""} params:`, params);
    return formProps.toggleSwitch("is_send_mail3", { label: "メールアドレス３送信フラグ", ...params }, is_debug);
  };
  /**
   * 性別 0:男性,1:女性スイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 性別 0:男性,1:女性スイッチのJSX要素
   */
  const switch_sex = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_sex form.sex:${form?.sex || ""} params:`, params);
    return formProps.toggleSwitch("sex", { label: "性別 0:男性,1:女性", ...params }, is_debug);
  };
  /**
   * 都道府県IDスイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 都道府県IDスイッチのJSX要素
   */
  const switch_province_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_province_id form.province_id:${form?.province_id || ""} params:`, params);
    return formProps.toggleSwitch("province_id", { label: "都道府県ID", ...params }, is_debug);
  };
  /**
   * 喫煙フラグ true:禁煙 false:喫煙スイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 喫煙フラグ true:禁煙 false:喫煙スイッチのJSX要素
   */
  const switch_is_smoking = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_is_smoking form.is_smoking:${form?.is_smoking || ""} params:`, params);
    return formProps.toggleSwitch("is_smoking", { label: "喫煙フラグ true:禁煙 false:喫煙", ...params }, is_debug);
  };
  /**
   * 血液型 A:1, O:2, B:3, AB:4スイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 血液型 A:1, O:2, B:3, AB:4スイッチのJSX要素
   */
  const switch_blood_type = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_blood_type form.blood_type:${form?.blood_type || ""} params:`, params);
    return formProps.toggleSwitch("blood_type", { label: "血液型 A:1, O:2, B:3, AB:4", ...params }, is_debug);
  };
  /**
   * 配偶者有無スイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 配偶者有無スイッチのJSX要素
   */
  const switch_is_spouse = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_is_spouse form.is_spouse:${form?.is_spouse || ""} params:`, params);
    return formProps.toggleSwitch("is_spouse", { label: "配偶者有無", ...params }, is_debug);
  };
  /**
   * ユーザー権限スイッチ
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ユーザー権限スイッチのJSX要素
   */
  const switch_auth = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`switch_auth form.auth:${form?.auth || ""} params:`, params);
    return formProps.toggleSwitch("auth", { label: "ユーザー権限", ...params }, is_debug);
  };

  return {
    switch_is_deleted, switch_tinyint_col, switch_status, switch_is_send_mail1, switch_is_send_mail2, switch_is_send_mail3, switch_sex, switch_province_id, switch_is_smoking, switch_blood_type, switch_is_spouse, switch_auth
  };
};

export default useSwitchEx;