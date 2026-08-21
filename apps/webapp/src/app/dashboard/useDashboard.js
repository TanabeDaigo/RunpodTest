"use client";

import { hooks } from "@common/client";
import { logjs } from "@lib/client";
const log = new logjs("dashboard/useDashboard");

export const useDashboard = () => {
  const [form, formProps] = hooks.useFormEx();

  return [
    {
      ...form,
    },
    {
      ...formProps,
    },
  ];
};
