/**
 * @file useInputEx.js
 * @description フォーム入力フィールドを簡単に生成するためのカスタムフック
 *
 * このフックは、Material-UIのコンポーネントを使用して、
 * スタイリッシュで機能的なフォーム入力フィールドを提供します。
 * 特に、パスワード入力フィールドの可視性切り替え機能を
 * 簡単に実装できるように設計されています。
 *
 * @example
 * // 基本的な使用例
 * const [form, formProps] = useFormEx();
 * const { input_password } = useInputEx(form, formProps);
 *
 * // コンポーネント内での使用
 * return (
 *   <form>
 *     {input_password({
 *       name: "userPassword",
 *       label: "パスワードを入力",
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

const log = new logjs("useInputEx");

/**
 * フォーム入力フィールドを生成するためのカスタムフック
 * @param {Object} form - フォームデータオブジェクト
 * @param {Object} formProps - フォームプロパティオブジェクト
 * @returns {Object} 各種入力フィールド生成関数のオブジェクト
 */
const useInputEx = (form = {}, formProps = {}) => {
  const is_standard = true; // 標準のinput要素を使用するかどうか
  /**
   * ID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ID入力フィールドのJSX要素
   */
  const input_auto_make_items_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_auto_make_items_id form.auto_make_items_id:${form?.auto_make_items_id || ""} params:`, params);
    return formProps.input("auto_make_items_id", { label: "ID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * プロジェクトID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} プロジェクトID入力フィールドのJSX要素
   */
  const input_project_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_project_id form.project_id:${form?.project_id || ""} params:`, params);
    return formProps.input("project_id", { label: "プロジェクトID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * タイトル入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} タイトル入力フィールドのJSX要素
   */
  const input_title = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_title form.title:${form?.title || ""} params:`, params);
    return formProps.input("title", { label: "タイトル", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * ディレクトリ名入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ディレクトリ名入力フィールドのJSX要素
   */
  const input_dir_name = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_dir_name form.dir_name:${form?.dir_name || ""} params:`, params);
    return formProps.input("dir_name", { label: "ディレクトリ名", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * URL入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} URL入力フィールドのJSX要素
   */
  const input_url = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_url form.url:${form?.url || ""} params:`, params);
    return formProps.input("url", { label: "URL", maxlength: 128, is_standard, ...params }, is_debug);
  };
  /**
   * 対象テーブル名入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 対象テーブル名入力フィールドのJSX要素
   */
  const input_table_name = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_table_name form.table_name:${form?.table_name || ""} params:`, params);
    return formProps.input("table_name", { label: "対象テーブル名", maxlength: 128, is_standard, ...params }, is_debug);
  };
  /**
   * パラメータ入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} パラメータ入力フィールドのJSX要素
   */
  const input_contents = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_contents form.contents:${form?.contents || ""} params:`, params);
    return formProps.input("contents", { label: "パラメータ", multiline: true, minRows: 4, maxRows: 12, is_standard, ...params }, is_debug);
  };
  /**
   * ソート順入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ソート順入力フィールドのJSX要素
   */
  const input_sort = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_sort form.sort:${form?.sort || ""} params:`, params);
    return formProps.input("sort", { label: "ソート順", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 物理削除入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 物理削除入力フィールドのJSX要素
   */
  const input_is_deleted = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_is_deleted form.is_deleted:${form?.is_deleted || ""} params:`, params);
    return formProps.input("is_deleted", { label: "物理削除", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 更新回数入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 更新回数入力フィールドのJSX要素
   */
  const input_dbcount = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_dbcount form.dbcount:${form?.dbcount || ""} params:`, params);
    return formProps.input("dbcount", { label: "更新回数", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 登録者入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 登録者入力フィールドのJSX要素
   */
  const input_regist_user = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_regist_user form.regist_user:${form?.regist_user || ""} params:`, params);
    return formProps.input("regist_user", { label: "登録者", maxlength: 32, is_standard, ...params }, is_debug);
  };
  /**
   * 更新者入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 更新者入力フィールドのJSX要素
   */
  const input_update_user = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_update_user form.update_user:${form?.update_user || ""} params:`, params);
    return formProps.input("update_user", { label: "更新者", maxlength: 32, is_standard, ...params }, is_debug);
  };
  /**
   * ID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ID入力フィールドのJSX要素
   */
  const input_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_id form.id:${form?.id || ""} params:`, params);
    return formProps.input("id", { label: "ID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * int型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} int型入力フィールドのJSX要素
   */
  const input_int_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_int_col form.int_col:${form?.int_col || ""} params:`, params);
    return formProps.input("int_col", { label: "int型", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * small int型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} small int型入力フィールドのJSX要素
   */
  const input_smallint_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_smallint_col form.smallint_col:${form?.smallint_col || ""} params:`, params);
    return formProps.input("smallint_col", { label: "small int型", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * tiny int型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} tiny int型入力フィールドのJSX要素
   */
  const input_tinyint_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_tinyint_col form.tinyint_col:${form?.tinyint_col || ""} params:`, params);
    return formProps.input("tinyint_col", { label: "tiny int型", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * medium int型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} medium int型入力フィールドのJSX要素
   */
  const input_mediumint_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_mediumint_col form.mediumint_col:${form?.mediumint_col || ""} params:`, params);
    return formProps.input("mediumint_col", { label: "medium int型", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * decimal型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} decimal型入力フィールドのJSX要素
   */
  const input_decimal_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_decimal_col form.decimal_col:${form?.decimal_col || ""} params:`, params);
    return formProps.input("decimal_col", { label: "decimal型", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * numeric型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} numeric型入力フィールドのJSX要素
   */
  const input_numeric_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_numeric_col form.numeric_col:${form?.numeric_col || ""} params:`, params);
    return formProps.input("numeric_col", { label: "numeric型", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * float型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} float型入力フィールドのJSX要素
   */
  const input_float_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_float_col form.float_col:${form?.float_col || ""} params:`, params);
    return formProps.input("float_col", { label: "float型", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * double型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} double型入力フィールドのJSX要素
   */
  const input_double_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_double_col form.double_col:${form?.double_col || ""} params:`, params);
    return formProps.input("double_col", { label: "double型", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * char型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} char型入力フィールドのJSX要素
   */
  const input_char_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_char_col form.char_col:${form?.char_col || ""} params:`, params);
    return formProps.input("char_col", { label: "char型", maxlength: 12, is_standard, ...params }, is_debug);
  };
  /**
   * varchar型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} varchar型入力フィールドのJSX要素
   */
  const input_varchar_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_varchar_col form.varchar_col:${form?.varchar_col || ""} params:`, params);
    return formProps.input("varchar_col", { label: "varchar型", maxlength: 255, is_standard, ...params }, is_debug);
  };
  /**
   * text型入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} text型入力フィールドのJSX要素
   */
  const input_text_col = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_text_col form.text_col:${form?.text_col || ""} params:`, params);
    return formProps.input("text_col", { label: "text型", maxlength: 65535, multiline: true, minRows: 4, maxRows: 12, is_standard, ...params }, is_debug);
  };
  /**
   * カテゴリID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} カテゴリID入力フィールドのJSX要素
   */
  const input_category_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_category_id form.category_id:${form?.category_id || ""} params:`, params);
    return formProps.input("category_id", { label: "カテゴリID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 種別入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 種別入力フィールドのJSX要素
   */
  const input_type = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_type form.type:${form?.type || ""} params:`, params);
    return formProps.input("type", { label: "種別", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 名称入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 名称入力フィールドのJSX要素
   */
  const input_name = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_name form.name:${form?.name || ""} params:`, params);
    return formProps.input("name", { label: "名称", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * コメント入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} コメント入力フィールドのJSX要素
   */
  const input_comments = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_comments form.comments:${form?.comments || ""} params:`, params);
    return formProps.input("comments", { label: "コメント", maxlength: 65535, multiline: true, minRows: 4, maxRows: 12, is_standard, ...params }, is_debug);
  };
  /**
   * ステータス 1:削除済入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ステータス 1:削除済入力フィールドのJSX要素
   */
  const input_status = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_status form.status:${form?.status || ""} params:`, params);
    return formProps.input("status", { label: "ステータス 1:削除済", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 説明入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 説明入力フィールドのJSX要素
   */
  const input_explan = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_explan form.explan:${form?.explan || ""} params:`, params);
    return formProps.input("explan", { label: "説明", maxlength: 65535, multiline: true, minRows: 4, maxRows: 12, is_standard, ...params }, is_debug);
  };
  /**
   * 登録者入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 登録者入力フィールドのJSX要素
   */
  const input_registuser = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_registuser form.registuser:${form?.registuser || ""} params:`, params);
    return formProps.input("registuser", { label: "登録者", maxlength: 32, is_standard, ...params }, is_debug);
  };
  /**
   * 更新者入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 更新者入力フィールドのJSX要素
   */
  const input_updateuser = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_updateuser form.updateuser:${form?.updateuser || ""} params:`, params);
    return formProps.input("updateuser", { label: "更新者", maxlength: 32, is_standard, ...params }, is_debug);
  };
  /**
   * ID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ID入力フィールドのJSX要素
   */
  const input_dbms_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_dbms_id form.dbms_id:${form?.dbms_id || ""} params:`, params);
    return formProps.input("dbms_id", { label: "ID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * DBMS名入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} DBMS名入力フィールドのJSX要素
   */
  const input_dbms_name = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_dbms_name form.dbms_name:${form?.dbms_name || ""} params:`, params);
    return formProps.input("dbms_name", { label: "DBMS名", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * 業界ID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 業界ID入力フィールドのJSX要素
   */
  const input_industry_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_industry_id form.industry_id:${form?.industry_id || ""} params:`, params);
    return formProps.input("industry_id", { label: "業界ID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 区分ID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 区分ID入力フィールドのJSX要素
   */
  const input_section_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_section_id form.section_id:${form?.section_id || ""} params:`, params);
    return formProps.input("section_id", { label: "区分ID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 都道府県ID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 都道府県ID入力フィールドのJSX要素
   */
  const input_prefectury_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_prefectury_id form.prefectury_id:${form?.prefectury_id || ""} params:`, params);
    return formProps.input("prefectury_id", { label: "都道府県ID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 地方ID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 地方ID入力フィールドのJSX要素
   */
  const input_area_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_area_id form.area_id:${form?.area_id || ""} params:`, params);
    return formProps.input("area_id", { label: "地方ID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 名称入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 名称入力フィールドのJSX要素
   */
  const input_project_name = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_project_name form.project_name:${form?.project_name || ""} params:`, params);
    return formProps.input("project_name", { label: "名称", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * サーバー名入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} サーバー名入力フィールドのJSX要素
   */
  const input_db_server = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_db_server form.db_server:${form?.db_server || ""} params:`, params);
    return formProps.input("db_server", { label: "サーバー名", maxlength: 64, isIpAddress: true, is_standard, ...params }, is_debug);
  };
  /**
   * ポート番号入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ポート番号入力フィールドのJSX要素
   */
  const input_db_port = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_db_port form.db_port:${form?.db_port || ""} params:`, params);
    return formProps.input("db_port", { label: "ポート番号", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * DB名入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} DB名入力フィールドのJSX要素
   */
  const input_db_name = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_db_name form.db_name:${form?.db_name || ""} params:`, params);
    return formProps.input("db_name", { label: "DB名", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * DBユーザー名入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} DBユーザー名入力フィールドのJSX要素
   */
  const input_db_user = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_db_user form.db_user:${form?.db_user || ""} params:`, params);
    return formProps.input("db_user", { label: "DBユーザー名", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * DBパスワード入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} DBパスワード入力フィールドのJSX要素
   */
  const input_db_pass = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_db_pass form.db_pass:${form?.db_pass || ""} params:`, params);
    return formProps.input("db_pass", { label: "DBパスワード", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * DB文字コード入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} DB文字コード入力フィールドのJSX要素
   */
  const input_db_encoding = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_db_encoding form.db_encoding:${form?.db_encoding || ""} params:`, params);
    return formProps.input("db_encoding", { label: "DB文字コード", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * テンプレートID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} テンプレートID入力フィールドのJSX要素
   */
  const input_template_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_template_id form.template_id:${form?.template_id || ""} params:`, params);
    return formProps.input("template_id", { label: "テンプレートID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * ID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ID入力フィールドのJSX要素
   */
  const input_setting_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_setting_id form.setting_id:${form?.setting_id || ""} params:`, params);
    return formProps.input("setting_id", { label: "ID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 入力フィールドのJSX要素
   */
  const input_contexts = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_contexts form.contexts:${form?.contexts || ""} params:`, params);
    return formProps.input("contexts", { label: "", multiline: true, minRows: 4, maxRows: 12, is_standard, ...params }, is_debug);
  };
  /**
   * ID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ID入力フィールドのJSX要素
   */
  const input_status_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_status_id form.status_id:${form?.status_id || ""} params:`, params);
    return formProps.input("status_id", { label: "ID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 背景カラーコード入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 背景カラーコード入力フィールドのJSX要素
   */
  const input_background_color = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_background_color form.background_color:${form?.background_color || ""} params:`, params);
    return formProps.input("background_color", { label: "背景カラーコード", maxlength: 12, is_standard, ...params }, is_debug);
  };
  /**
   * 文字カラーコード入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 文字カラーコード入力フィールドのJSX要素
   */
  const input_color = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_color form.color:${form?.color || ""} params:`, params);
    return formProps.input("color", { label: "文字カラーコード", maxlength: 12, is_standard, ...params }, is_debug);
  };
  /**
   * ユーザーID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ユーザーID入力フィールドのJSX要素
   */
  const input_user_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_user_id form.user_id:${form?.user_id || ""} params:`, params);
    return formProps.input("user_id", { label: "ユーザーID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * ログインID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ログインID入力フィールドのJSX要素
   */
  const input_login_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_login_id form.login_id:${form?.login_id || ""} params:`, params);
    return formProps.input("login_id", { label: "ログインID", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * パスワード入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} パスワード入力フィールドのJSX要素
   */
  const input_password = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_password form.password:${form?.password || ""} params:`, params);
    return formProps.input("password", { label: "パスワード", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * パスワード暗号化キー入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} パスワード暗号化キー入力フィールドのJSX要素
   */
  const input_password_key = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_password_key form.password_key:${form?.password_key || ""} params:`, params);
    return formProps.input("password_key", { label: "パスワード暗号化キー", maxlength: 12, is_standard, ...params }, is_debug);
  };
  /**
   * 名前(姓)入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 名前(姓)入力フィールドのJSX要素
   */
  const input_last_name = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_last_name form.last_name:${form?.last_name || ""} params:`, params);
    return formProps.input("last_name", { label: "名前(姓)", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * 名前(名)入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 名前(名)入力フィールドのJSX要素
   */
  const input_user_name = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_user_name form.user_name:${form?.user_name || ""} params:`, params);
    return formProps.input("user_name", { label: "名前(名)", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * 名前かたかな(姓)入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 名前かたかな(姓)入力フィールドのJSX要素
   */
  const input_katakana_last_name = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_katakana_last_name form.katakana_last_name:${form?.katakana_last_name || ""} params:`, params);
    return formProps.input("katakana_last_name", { label: "名前かたかな(姓)", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * 名前かたかな(名)入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 名前かたかな(名)入力フィールドのJSX要素
   */
  const input_katakana_name = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_katakana_name form.katakana_name:${form?.katakana_name || ""} params:`, params);
    return formProps.input("katakana_name", { label: "名前かたかな(名)", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * メールアドレス１入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス１入力フィールドのJSX要素
   */
  const input_mail1 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_mail1 form.mail1:${form?.mail1 || ""} params:`, params);
    return formProps.input("mail1", { label: "メールアドレス１", maxlength: 64, isMailAddress: true, is_standard, ...params }, is_debug);
  };
  /**
   * メールアドレス１送信フラグ入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス１送信フラグ入力フィールドのJSX要素
   */
  const input_is_send_mail1 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_is_send_mail1 form.is_send_mail1:${form?.is_send_mail1 || ""} params:`, params);
    return formProps.input("is_send_mail1", { label: "メールアドレス１送信フラグ", isNumberOnly: true, isMinus: true, isMailAddress: true, is_standard, ...params }, is_debug);
  };
  /**
   * メールアドレス２入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス２入力フィールドのJSX要素
   */
  const input_mail2 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_mail2 form.mail2:${form?.mail2 || ""} params:`, params);
    return formProps.input("mail2", { label: "メールアドレス２", maxlength: 64, isMailAddress: true, is_standard, ...params }, is_debug);
  };
  /**
   * メールアドレス２送信フラグ入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス２送信フラグ入力フィールドのJSX要素
   */
  const input_is_send_mail2 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_is_send_mail2 form.is_send_mail2:${form?.is_send_mail2 || ""} params:`, params);
    return formProps.input("is_send_mail2", { label: "メールアドレス２送信フラグ", isNumberOnly: true, isMinus: true, isMailAddress: true, is_standard, ...params }, is_debug);
  };
  /**
   * メールアドレス３入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス３入力フィールドのJSX要素
   */
  const input_mail3 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_mail3 form.mail3:${form?.mail3 || ""} params:`, params);
    return formProps.input("mail3", { label: "メールアドレス３", maxlength: 64, isMailAddress: true, is_standard, ...params }, is_debug);
  };
  /**
   * メールアドレス３送信フラグ入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} メールアドレス３送信フラグ入力フィールドのJSX要素
   */
  const input_is_send_mail3 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_is_send_mail3 form.is_send_mail3:${form?.is_send_mail3 || ""} params:`, params);
    return formProps.input("is_send_mail3", { label: "メールアドレス３送信フラグ", isNumberOnly: true, isMinus: true, isMailAddress: true, is_standard, ...params }, is_debug);
  };
  /**
   * 受信メール形式入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 受信メール形式入力フィールドのJSX要素
   */
  const input_incoming_mail_format = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_incoming_mail_format form.incoming_mail_format:${form?.incoming_mail_format || ""} params:`, params);
    return formProps.input("incoming_mail_format", { label: "受信メール形式", isNumberOnly: true, isMinus: true, isMailAddress: true, is_standard, ...params }, is_debug);
  };
  /**
   * 性別 0:男性,1:女性入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 性別 0:男性,1:女性入力フィールドのJSX要素
   */
  const input_sex = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_sex form.sex:${form?.sex || ""} params:`, params);
    return formProps.input("sex", { label: "性別 0:男性,1:女性", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 郵便番号(上3桁)入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 郵便番号(上3桁)入力フィールドのJSX要素
   */
  const input_post_first_no = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_post_first_no form.post_first_no:${form?.post_first_no || ""} params:`, params);
    return formProps.input("post_first_no", { label: "郵便番号(上3桁)", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 郵便番号(下4桁)入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 郵便番号(下4桁)入力フィールドのJSX要素
   */
  const input_post_last_no = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_post_last_no form.post_last_no:${form?.post_last_no || ""} params:`, params);
    return formProps.input("post_last_no", { label: "郵便番号(下4桁)", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 都道府県ID入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 都道府県ID入力フィールドのJSX要素
   */
  const input_province_id = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_province_id form.province_id:${form?.province_id || ""} params:`, params);
    return formProps.input("province_id", { label: "都道府県ID", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 住所１入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 住所１入力フィールドのJSX要素
   */
  const input_address1 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_address1 form.address1:${form?.address1 || ""} params:`, params);
    return formProps.input("address1", { label: "住所１", maxlength: 128, is_standard, ...params }, is_debug);
  };
  /**
   * 住所２入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 住所２入力フィールドのJSX要素
   */
  const input_address2 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_address2 form.address2:${form?.address2 || ""} params:`, params);
    return formProps.input("address2", { label: "住所２", maxlength: 128, is_standard, ...params }, is_debug);
  };
  /**
   * 住所３入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 住所３入力フィールドのJSX要素
   */
  const input_address3 = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_address3 form.address3:${form?.address3 || ""} params:`, params);
    return formProps.input("address3", { label: "住所３", maxlength: 128, is_standard, ...params }, is_debug);
  };
  /**
   * 最寄駅入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 最寄駅入力フィールドのJSX要素
   */
  const input_nearest_station = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_nearest_station form.nearest_station:${form?.nearest_station || ""} params:`, params);
    return formProps.input("nearest_station", { label: "最寄駅", maxlength: 32, is_standard, ...params }, is_debug);
  };
  /**
   * 出身地入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 出身地入力フィールドのJSX要素
   */
  const input_birthplace = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_birthplace form.birthplace:${form?.birthplace || ""} params:`, params);
    return formProps.input("birthplace", { label: "出身地", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * 国籍入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 国籍入力フィールドのJSX要素
   */
  const input_nationality = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_nationality form.nationality:${form?.nationality || ""} params:`, params);
    return formProps.input("nationality", { label: "国籍", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * 役職入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 役職入力フィールドのJSX要素
   */
  const input_official_position = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_official_position form.official_position:${form?.official_position || ""} params:`, params);
    return formProps.input("official_position", { label: "役職", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * 部門入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 部門入力フィールドのJSX要素
   */
  const input_department = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_department form.department:${form?.department || ""} params:`, params);
    return formProps.input("department", { label: "部門", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * 組織入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 組織入力フィールドのJSX要素
   */
  const input_organization = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_organization form.organization:${form?.organization || ""} params:`, params);
    return formProps.input("organization", { label: "組織", maxlength: 64, is_standard, ...params }, is_debug);
  };
  /**
   * 喫煙フラグ true:禁煙 false:喫煙入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 喫煙フラグ true:禁煙 false:喫煙入力フィールドのJSX要素
   */
  const input_is_smoking = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_is_smoking form.is_smoking:${form?.is_smoking || ""} params:`, params);
    return formProps.input("is_smoking", { label: "喫煙フラグ true:禁煙 false:喫煙", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 血液型 A:1, O:2, B:3, AB:4入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 血液型 A:1, O:2, B:3, AB:4入力フィールドのJSX要素
   */
  const input_blood_type = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_blood_type form.blood_type:${form?.blood_type || ""} params:`, params);
    return formProps.input("blood_type", { label: "血液型 A:1, O:2, B:3, AB:4", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * 配偶者有無入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} 配偶者有無入力フィールドのJSX要素
   */
  const input_is_spouse = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_is_spouse form.is_spouse:${form?.is_spouse || ""} params:`, params);
    return formProps.input("is_spouse", { label: "配偶者有無", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * ユーザー権限入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ユーザー権限入力フィールドのJSX要素
   */
  const input_auth = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_auth form.auth:${form?.auth || ""} params:`, params);
    return formProps.input("auth", { label: "ユーザー権限", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };
  /**
   * ログイン状態入力フィールドを生成する関数
   * @param {Object} params - 追加のパラメータ
   * @param {boolean} is_debug - デバッグモードの有効/無効
   * @returns {JSX.Element} ログイン状態入力フィールドのJSX要素
   */
  const input_login_state = (params = {}, is_debug = false) => {
    if (is_debug) log.debug(`input_login_state form.login_state:${form?.login_state || ""} params:`, params);
    return formProps.input("login_state", { label: "ログイン状態", isNumberOnly: true, isMinus: true, is_standard, ...params }, is_debug);
  };

  return {
    input_auto_make_items_id,
    input_project_id,
    input_title,
    input_dir_name,
    input_url,
    input_table_name,
    input_contents,
    input_sort,
    input_is_deleted,
    input_dbcount,
    input_regist_user,
    input_update_user,
    input_id,
    input_int_col,
    input_smallint_col,
    input_tinyint_col,
    input_mediumint_col,
    input_decimal_col,
    input_numeric_col,
    input_float_col,
    input_double_col,
    input_char_col,
    input_varchar_col,
    input_text_col,
    input_category_id,
    input_type,
    input_name,
    input_comments,
    input_status,
    input_explan,
    input_registuser,
    input_updateuser,
    input_dbms_id,
    input_dbms_name,
    input_industry_id,
    input_section_id,
    input_prefectury_id,
    input_area_id,
    input_project_name,
    input_db_server,
    input_db_port,
    input_db_name,
    input_db_user,
    input_db_pass,
    input_db_encoding,
    input_template_id,
    input_setting_id,
    input_contexts,
    input_status_id,
    input_background_color,
    input_color,
    input_user_id,
    input_login_id,
    input_password,
    input_password_key,
    input_last_name,
    input_user_name,
    input_katakana_last_name,
    input_katakana_name,
    input_mail1,
    input_is_send_mail1,
    input_mail2,
    input_is_send_mail2,
    input_mail3,
    input_is_send_mail3,
    input_incoming_mail_format,
    input_sex,
    input_post_first_no,
    input_post_last_no,
    input_province_id,
    input_address1,
    input_address2,
    input_address3,
    input_nearest_station,
    input_birthplace,
    input_nationality,
    input_official_position,
    input_department,
    input_organization,
    input_is_smoking,
    input_blood_type,
    input_is_spouse,
    input_auth,
    input_login_state,
  };
};

export default useInputEx;
