/**
 * ================================================================
 * |                                                               |
 * |   MetroJS - Extended Validation Hook                          |
 * |   Copyright (c) 2024 Metro Digital Solutions                  |
 * |                                                               |
 * |   フォームバリデーションの拡張機能                             |
 * |   ログ出力機能付きのバリデーション機能を提供                  |
 * |                                                               |
 * ================================================================
 *
 * このファイルはフォームバリデーションの拡張機能を提供します。
 * 主な機能：
 * - 工事コードのバリデーション（9桁固定）
 * - 支店コードのバリデーション（2桁固定）
 * - 管理番号のバリデーション（英数字記号のみ）
 * - カメラシリアル番号のバリデーション（英数字記号のみ）
 * - 納期日のバリデーション（有効な日付形式）
 * - 返却日のバリデーション（有効な日付形式）
 *
 * @file useValidationEx.js
 * @module client/hooks/useValidationEx
 */

import { hooks } from "@metrojs/client";
import logjs from "@metrojs/logjs";

const log = new logjs("useValidationEx");

/**
 * 拡張バリデーションフック
 * ログ出力機能付きのバリデーション機能を提供します
 *
 * @param {Object} form - バリデーション対象のフォームオブジェクト
 * @returns {Array} [errors, validationProps] - エラーとバリデーション関数群
 */
export const useValidationEx = (form = {}) => {
  // 基本バリデーションフックからエラーとバリデーション関数を取得
  const [errors, validProps] = hooks.useValidation(form);

  /**
   * 工事コードのバリデーション
   * 必須チェックと9桁固定チェックを実行します
   *
   * @param {string} key - チェック対象のフォームキー
   * @param {string} name - フォーム名（デフォルト: "工事コード"）
   * @returns {boolean} バリデーション結果（true: 成功, false: 失敗）
   */
  const checkKojiCode = (key, name = "工事コード") => {
    log.debug(`checkKojiCode key:${key} name:${name}`, form);
    try {
      let ret = true;

      // 必須チェック
      ret = validProps.checkRequired(key, name);
      if (ret == false) {
        log.debug(`checkKojiCode 必須チェック key:${key} name:${name} ret:${ret}`);
        return false;
      }

      // 9桁固定チェック
      ret = validProps.checkFixedLength(key, name, 9);
      if (ret == false) {
        log.debug(`checkKojiCode 9桁固定チェック key:${key} name:${name} ret:${ret}`);
        return false;
      }

      return true;
    } catch (e) {
      log.error(e);
    } finally {
      // デバッグ用：エラー内容を出力
      validProps.debugerrors();
    }
  };

  /**
   * 支店コードのバリデーション
   * 必須チェックと2桁固定チェックを実行します
   *
   * @param {string} key - チェック対象のフォームキー
   * @param {string} name - フォーム名（デフォルト: "支店コード"）
   * @returns {boolean} バリデーション結果（true: 成功, false: 失敗）
   */
  const checkShitenCode = (key, name = "支店コード") => {
    log.debug(`checkShitenCode key:${key} name:${name}`, form);
    try {
      let ret = true;

      // 必須チェック
      ret = validProps.checkRequired(key, name);
      if (ret == false) {
        log.debug(`checkShitenCode 必須チェック key:${key} name:${name} ret:${ret}`);
        return false;
      }

      // 2桁固定チェック
      ret = validProps.checkFixedLength(key, name, 2);
      if (ret == false) {
        log.debug(`checkShitenCode 2桁固定チェック key:${key} name:${name} ret:${ret}`);
        return false;
      }

      return true;
    } catch (e) {
      log.error(e);
    } finally {
      // デバッグ用：エラー内容を出力
      validProps.debugerrors();
    }
  };

  /**
   * 管理番号のバリデーション
   * 必須チェックと英数字記号のみチェックを実行します
   *
   * @param {string} key - チェック対象のフォームキー
   * @param {string} name - フォーム名（デフォルト: "管理番号"）
   * @returns {boolean} バリデーション結果（true: 成功, false: 失敗）
   */
  const checkReferenceNo = (key, name = "管理番号") => {
    log.debug(`checkReferenceNo key:${key} name:${name}`, form);
    try {
      let ret = true;

      // 必須チェック
      ret = validProps.checkRequired(key, name);
      if (ret == false) {
        log.debug(`checkReferenceNo 必須チェック key:${key} name:${name} ret:${ret}`);
        return false;
      }

      // 英数字記号のみチェック
      ret = validProps.checkAlphanumericSymbolsOnly(key, name);
      if (ret == false) {
        log.debug(`checkReferenceNo 英数字記号のみチェック key:${key} name:${name} ret:${ret}`);
        return false;
      }

      return true;
    } catch (e) {
      log.error(e);
    } finally {
      // デバッグ用：エラー内容を出力
      validProps.debugerrors();
    }
  };

  /**
   * カメラシリアル番号のバリデーション
   * 必須チェックと英数字記号のみチェックを実行します
   *
   * @param {string} key - チェック対象のフォームキー
   * @param {string} name - フォーム名（デフォルト: "カメラシリアル番号"）
   * @returns {boolean} バリデーション結果（true: 成功, false: 失敗）
   */
  const checkCameraSerialNo = (key, name = "カメラシリアル番号") => {
    log.debug(`checkCameraSerialNo key:${key} name:${name}`, form);
    try {
      let ret = true;

      // 必須チェック
      ret = validProps.checkRequired(key, name);
      if (ret == false) {
        log.debug(`checkCameraSerialNo 必須チェック key:${key} name:${name} ret:${ret}`);
        return false;
      }

      // 英数字記号のみチェック
      ret = validProps.checkAlphanumericSymbolsOnly(key, name);
      if (ret == false) {
        log.debug(`checkCameraSerialNo 英数字記号のみチェック key:${key} name:${name} ret:${ret}`);
        return false;
      }

      return true;
    } catch (e) {
      log.error(e);
    } finally {
      // デバッグ用：エラー内容を出力
      validProps.debugerrors();
    }
  };

  /**
   * 納期日のバリデーション
   * 有効な日付形式チェックを実行します
   *
   * @param {string} key - チェック対象のフォームキー
   * @param {string} name - フォーム名（デフォルト: "納期日"）
   * @returns {boolean} バリデーション結果（true: 成功, false: 失敗）
   */
  const checkDeliveryDate = (key, name = "納期日") => {
    log.debug(`checkDeliveryDate key:${key} name:${name}`, form);
    try {
      let ret = true;

      // 有効な日付形式チェック
      ret = validProps.checkValidDate(key, name, "YYYY/MM/DD");
      if (ret == false) {
        log.debug(`checkDeliveryDate 有効な日付形式チェック key:${key} name:${name} ret:${ret}`);
        return false;
      }

      return true;
    } catch (e) {
      log.error(e);
    } finally {
      // デバッグ用：エラー内容を出力
      validProps.debugerrors();
    }
  };

  /**
   * 返却日のバリデーション
   * 有効な日付形式チェックを実行します
   *
   * @param {string} key - チェック対象のフォームキー
   * @param {string} name - フォーム名（デフォルト: "返却日"）
   * @returns {boolean} バリデーション結果（true: 成功, false: 失敗）
   */
  const checkReturnDate = (key, name = "返却日") => {
    log.debug(`checkReturnDate key:${key} name:${name}`, form);
    try {
      let ret = true;

      // 有効な日付形式チェック
      ret = validProps.checkValidDate(key, name, "YYYY/MM/DD");
      if (ret == false) {
        return false;
      }

      return true;
    } catch (e) {
      log.error(e);
    } finally {
      // デバッグ用：エラー内容を出力
      validProps.debugerrors();
    }
  };

  // 基本バリデーション関数と拡張バリデーション関数を結合して返却
  return [
    errors,
    {
      ...validProps,
      checkKojiCode,
      checkShitenCode,
      checkReferenceNo,
      checkCameraSerialNo,
      checkDeliveryDate,
      checkReturnDate,
    },
  ];
};
