/**
 * @file useAutoCompleteEx.js
 * @description フォーム自動補完フィールドを簡単に生成するためのカスタムフック
 *
 * @example
 * // 基本的な使用例
 * const [form, formProps] = useFormEx();
 * const { autoComplete_dbms } = useAutoCompleteEx(form, formProps);
 *
 * // コンポーネント内での使用
 * return (
 *   <form>
 *     {autoComplete_dbms({
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
import * as React from "react";

import { apijs } from "@krono-metro/metrojs/client";

const log = new logjs("useAutoCompleteEx");
const api_common = new apijs("api/Common");

const useAutoCompleteEx = (form = {}, formProps = {}, state = {}, actions = {}) => {
  // formRefを更新
  /*
  React.useEffect(() => {
    if (form && typeof form === "object") {
      formRef.current = form;
      setIsFormReady(true);
      log.debug("useAutoCompleteEx - form updated:", form);
    } else {
      log.warn("useAutoCompleteEx - invalid form:", form);
      setIsFormReady(false);
    }
    setIsInitialized(true);
  }, [form]);

  // カメラシリアル番号の初期データ取得
  React.useEffect(() => {
    const fetchCameraSerialNoOptions = async () => {
      if ((!camera_serial_no_options || camera_serial_no_options.length === 0) && isFormReady && isInitialized && formRef.current) {
        try {
          const currentForm = formRef.current || {};
          log.debug("fetchCameraSerialNoOptions - calling API with form:", currentForm);

          // currentFormが有効なオブジェクトかチェック
          if (!currentForm || typeof currentForm !== "object") {
            log.warn("fetchCameraSerialNoOptions - currentForm is invalid:", currentForm);
            setCameraSerialNoOptions([]);
            return;
          }
          log.debug("fetchCameraSerialNoOptions - state:", state);
          if (state.user == null) {
            log.warn("fetchCameraSerialNoOptions - user is null");
            setCameraSerialNoOptions([]);
            return;
          }

          const res = await api_common.post({
            mode: "find_camera_serial_no",
            form: { ...currentForm, keyword: "" },
          });
          log.debug("fetchCameraSerialNoOptions - API response:", res);
          setCameraSerialNoOptions(res || []);
        } catch (error) {
          log.error("fetchCameraSerialNoOptions error:", error);
          log.error("fetchCameraSerialNoOptions error details:", {
            message: error.message,
            stack: error.stack,
            currentForm: formRef.current,
          });
          setCameraSerialNoOptions([]);
        }
      }
    };

    // formRef.currentが初期化されている場合のみ実行
    if (isFormReady && isInitialized && formRef.current) {
      fetchCameraSerialNoOptions();
    }
  }, [camera_serial_no_options?.length, isFormReady, isInitialized]);

  // after_funcの処理
  const handleAfterFunc = React.useCallback(
    async (result) => {
      log.debug(`after_func result.koji_code:${result.koji_code}`, koji_info_options);

      if (!isFormReady || !isInitialized || !formRef.current) {
        log.warn("handleAfterFunc - form is not ready, not initialized, or formRef.current is not available");
        return;
      }

      try {
        const currentForm = formRef.current || {};

        // currentFormが有効なオブジェクトかチェック
        if (!currentForm || typeof currentForm !== "object") {
          log.warn("handleAfterFunc - currentForm is invalid:", currentForm);
          return;
        }

        const res = await api_common.post({
          mode: findModeRef.current,
          form: { ...currentForm, keyword: result.koji_code },
        });
        setKojiInfoOptions(res || []);
        log.debug("options", res);
      } catch (error) {
        log.error("handleAfterFunc error:", error);
        setKojiInfoOptions([]);
      }
    },
    [koji_info_options, isFormReady, isInitialized]
  );

  // カメラシリアル番号のafter_funcの処理
  const handleCameraAfterFunc = React.useCallback(
    async (result) => {
      log.debug(`after_func result.camera_serial_no:${result.camera_serial_no}`, camera_serial_no_options);

      if (!isFormReady || !isInitialized || !formRef.current) {
        log.warn("handleCameraAfterFunc - form is not ready, not initialized, or formRef.current is not available");
        return;
      }

      try {
        const currentForm = formRef.current || {};

        // currentFormが有効なオブジェクトかチェック
        if (!currentForm || typeof currentForm !== "object") {
          log.warn("handleCameraAfterFunc - currentForm is invalid:", currentForm);
          return;
        }

        const res = await api_common.post({
          mode: cameraFindModeRef.current,
          form: { ...currentForm, keyword: result.camera_serial_no },
        });
        setCameraSerialNoOptions(res || []);
        log.debug("camera options", res);
      } catch (error) {
        log.error("handleCameraAfterFunc error:", error);
        setCameraSerialNoOptions([]);
      }
    },
    [camera_serial_no_options, isFormReady, isInitialized]
  );
*/
  const autoComplete_koji_info = (params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(`autoComplete_koji_info params:`, params);
    }

    return formProps.autoComplete(
      "koji_info",
      {
        label: "工事コード",
        freeSolo: true,
        ...params,
      },
      is_debug
    );
  };
  /*
  const autoComplete_camera_serial_no = (find_mode = "find_camera_serial_no", params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(`autoComplete_camera_serial_no params:`, params);
    }

    // refを更新
    formRef.current = form;
    cameraFindModeRef.current = find_mode;

    return formProps.autoComplete(
      "camera_serial_no",
      {
        label: "カメラシリアル番号",
        freeSolo: true,
        options: camera_serial_no_options || [],
        after_func: handleCameraAfterFunc,
        ...params,
      },
      is_debug
    );
  };
  */

  return {
    autoComplete_koji_info,
  };
};

export default useAutoCompleteEx;
