"use client";

import * as React from "react";
import { providers } from "@lib/client";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BugReportIcon from "@mui/icons-material/BugReport";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";

/**
 * ナビゲーションアイテムを生成する関数
 * @param {Object} props - プロパティ
 * @param {Object} props.contextValue - WebAppContextの値
 * @param {Function} props.handleNavigation - ナビゲーション処理を行う関数
 * @returns {Array} ナビゲーションアイテムの配列
 */
export default function Navigation({ contextValue, handleNavigation }) {
  return [
    {
      segment: "dashboard",
      title: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
      onClick: () => handleNavigation("/dashboard"),
    },
    {
      segment: "account",
      title: "Account",
      icon: <PersonIcon />,
      path: "/account",
      onClick: () => handleNavigation("/account"),
    },
    // 区切り線
    {
      kind: "divider",
    },
    {
      segment: "master",
      title: "マスタ管理",
      icon: <BarChartIcon />,
      children: [
        {
          segment: "projects",
          title: "プロジェクト管理",
          icon: <DescriptionIcon />,
          onClick: () => handleNavigation("../projects"),
        },
        {
          segment: "users",
          title: "ユーザー管理",
          icon: <PersonIcon />,
          onClick: () => handleNavigation("../users"),
        },
      ],
    },
    {
      segment: "unit_test_formEx",
      title: "FormExテスト",
      icon: <BugReportIcon />,
      children: [
        {
          segment: "useInputEx",
          title: "useInputExテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "useCheckBoxEx",
          title: "useCheckBoxExテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "useDatePickerEx",
          title: "useDatePickerExテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "useSwitchEx",
          title: "useSwitchExテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "useRadioEx",
          title: "useRadioExテスト",
          icon: <BugReportIcon />,
        },
      ],
    },

    {
      segment: "unit_test_dao",
      title: "DAOテスト",
      icon: <BarChartIcon />,
      path: "/unit_test_dao",
      onClick: () => handleNavigation("/unit_test_dao"),
    },
    // 単体テストセクション
    {
      segment: "unit_test",
      title: "ユニットテスト",
      icon: <BarChartIcon />,
      children: [
        {
          segment: "formEx",
          title: "FormExテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "dialog",
          title: "Dialogテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "alert",
          title: "Alertテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "confirm",
          title: "Confirmテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "snackbar",
          title: "Snackbarテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "navigate",
          title: "Navigateテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "loading",
          title: "Loadingテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "input",
          title: "Inputテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "button",
          title: "Buttonテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "iconButton",
          title: "IconButtonテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "iconMenu",
          title: "IconMenuテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "tooltip",
          title: "Tooltipテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "popper",
          title: "Popperテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "checkbox",
          title: "Checkboxテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "switch",
          title: "Switchテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "datePicker",
          title: "DatePickerテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "datePickerFromTo",
          title: "DatePickerFromToテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "link",
          title: "Linkテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "radio",
          title: "Radioテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "select",
          title: "Selectテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "selectMulti",
          title: "SelectMultiテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "autoComplete",
          title: "AutoComplete",
          icon: <BugReportIcon />,
        },
        {
          segment: "virtualizedTable",
          title: "VirtualizedTableページテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "collapsibleVirtualDataGrid",
          title: "CollapsibleVirtualDataGridページテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "sql",
          title: "dbjs,sqljsのテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "sendMail",
          title: "SendMailのテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "llm",
          title: "LLM / RAG 学習",
          icon: <BugReportIcon />,
        },
        {
          segment: "error",
          title: "Errorページテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "notFound",
          title: "Not Foundページテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "useValidation",
          title: "useValidationテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "upload",
          title: "uploadテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "download",
          title: "downloadテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "daigoTest",
          title: "daigoTestテスト",
          icon: <BugReportIcon />,
        },
        {
          segment: "sakutto",
          title: "サクッと記録（Sakutto）",
          icon: <BugReportIcon />,
        },
        {
          segment: "wysiwyg",
          title: "Wysiwygテスト",
          icon: <BugReportIcon />,
        },
      ],
    },
  ];
}
