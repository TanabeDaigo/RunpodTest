/**
 * @file useDatePickerEx.js
 * @description フォーム日付ピッカーフィールドを簡単に生成するためのカスタムフック
 *
 * このフックは、Material-UIのコンポーネントを使用して、
 * スタイリッシュで機能的な日付ピッカーフィールドを提供します。
 * データベーススキーマから自動生成された日付型カラムに対応した
 * 日付ピッカーフィールドを簡単に実装できるように設計されています。
 *
 * @example
 * // 基本的な使用例
 * const [form, formProps] = useFormEx();
 * const { datePicker_created_at, datePicker_updated_at } = useDatePickerEx(form, formProps);
 *
 * // コンポーネント内での使用
 * return (
 *   <form>
 *     {datePicker_created_at({
 *       name: "createdAt",
 *       label: "作成日時",
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

const log = new logjs("useDatePickerEx");

/**
 * フォーム日付ピッカーフィールドを生成するためのカスタムフック
 * @param {Object} form - フォームデータオブジェクト
 * @param {Object} formProps - フォームプロパティオブジェクト
 * @returns {Object} 各種日付ピッカーフィールド生成関数のオブジェクト
 */
const useDatePickerEx = (form = {}, formProps = {}) => {
  const is_standard = true; // 標準の日付ピッカーを使用するかどうか
  /**
   * 登録日時日付ピッカーフィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 登録日時日付ピッカーフィールドのJSX要素
   */
  const datePicker_created_at = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`datePicker_created_at form.created_at:${form?.created_at || ""} params:`, params);
    return formProps.datePicker("created_at", { label: "登録日時", is_standard, ...params }, is_debug);
  };
  /**
   * 更新日時日付ピッカーフィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 更新日時日付ピッカーフィールドのJSX要素
   */
  const datePicker_updated_at = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`datePicker_updated_at form.updated_at:${form?.updated_at || ""} params:`, params);
    return formProps.datePicker("updated_at", { label: "更新日時", is_standard, ...params }, is_debug);
  };
  /**
   * date型日付ピッカーフィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} date型日付ピッカーフィールドのJSX要素
   */
  const datePicker_date_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`datePicker_date_col form.date_col:${form?.date_col || ""} params:`, params);
    return formProps.datePicker("date_col", { label: "date型", is_standard, ...params }, is_debug);
  };
  /**
   * datetime型日付ピッカーフィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} datetime型日付ピッカーフィールドのJSX要素
   */
  const datePicker_datetime_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`datePicker_datetime_col form.datetime_col:${form?.datetime_col || ""} params:`, params);
    return formProps.datePicker("datetime_col", { label: "datetime型", is_standard, ...params }, is_debug);
  };
  /**
   * timestamp型日付ピッカーフィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} timestamp型日付ピッカーフィールドのJSX要素
   */
  const datePicker_timestamp_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`datePicker_timestamp_col form.timestamp_col:${form?.timestamp_col || ""} params:`, params);
    return formProps.datePicker("timestamp_col", { label: "timestamp型", is_standard, ...params }, is_debug);
  };
  /**
   * 生年月日日付ピッカーフィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 生年月日日付ピッカーフィールドのJSX要素
   */
  const datePicker_date_of_birth = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`datePicker_date_of_birth form.date_of_birth:${form?.date_of_birth || ""} params:`, params);
    return formProps.datePicker("date_of_birth", { label: "生年月日", is_standard, ...params }, is_debug);
  };
  /**
   * 初回ログイン日時日付ピッカーフィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 初回ログイン日時日付ピッカーフィールドのJSX要素
   */
  const datePicker_first_login_date = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`datePicker_first_login_date form.first_login_date:${form?.first_login_date || ""} params:`, params);
    return formProps.datePicker("first_login_date", { label: "初回ログイン日時", is_standard, ...params }, is_debug);
  };

  return {
    datePicker_created_at,
    datePicker_updated_at,
    datePicker_date_col,
    datePicker_datetime_col,
    datePicker_timestamp_col,
    datePicker_date_of_birth,
    datePicker_first_login_date,
  };
};

export default useDatePickerEx;
