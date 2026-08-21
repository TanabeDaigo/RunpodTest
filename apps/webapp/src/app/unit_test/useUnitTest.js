"use client";
//export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { logjs, apijs, hooks } from "@lib/client";

const log = new logjs("unit_test/useUnitTest");
const api = new apijs("api/test");

export const useUnitTest = (initState = {}, state, actions) => {
  const router = useRouter();

  const [form, formProps] = hooks.useFormEx(initState);

  const [data, setData] = useState([]);

  const executeApi = async () => {
    const res = await api.post({ mode: "test" });
    log.debug(res);
    setData(res.data);
  };

  const copyButton = (text) => {
    return formProps.iconButton("copy", {
      onClick: () => {
        navigator.clipboard.writeText(text);
        actions.showSnackbar("コードをクリップボードにコピーしました", "success");
      },
    });
  };
  return [
    {
      ...form,
    },
    {
      ...formProps,
      copyButton,
      executeApi,
    },
  ];
};
