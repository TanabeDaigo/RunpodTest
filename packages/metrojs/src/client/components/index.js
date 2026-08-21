"use client";
/**
 * MUIコンポーネントをラップした共通コンポーネント群
 *
 * @module components
 * @exports {Component} Button - カスタマイズされたMUIボタンコンポーネント
 * @exports {Component} Input - カスタマイズされたMUI入力コンポーネント
 * @exports {Component} Loading - ローディング表示用コンポーネント
 * @exports {Component} Snackbar - 通知表示用のスナックバーコンポーネント
 * @exports {Component} SnackbarAlert - アラート付きスナックバーコンポーネント
 */

import Button from "./mui/button/Button";
import IconButton from "./mui/button/IconButton";
import Checkbox from "./mui/checkbox/Checkbox";
import CollapsibleVirtualDataGrid from "./mui/collapsibleVirtualDataGrid/CollapsibleVirtualDataGrid";
import VirtualizedTable from "./mui/virtualizedTable/VirtualizedTable";
import DatePicker from "./mui/datePicker/DatePicker";
import DatePickerFromTo from "./mui/datePickerFromTo/DatePickerFromTo";
import Input from "./mui/input/Input";
import Link from "./mui/link/Link";
import Loading from "./mui/loading";
import Radio from "./mui/radio/Radio";
import Select from "./mui/select/Select";
import SelectMulti from "./mui/selectMulti/SelectMulti";
import AutoComplete from "./mui/autoComplete/AutoComplete";
import { Snackbar, SnackbarAlert } from "./mui/snackbar";
import IconMenu from "./mui/iconMenu/IconMenu";
import Upload from "./mui/upload/Upload";
import Download from "./mui/download/Download";
import Switch from "./mui/switch/Switch";
import Pagination from "./mui/pagination/Pagination";
import Tooltip from "./mui/tooltip/Tooltip";
import Popper from "./mui/popper/Popper";
import Wysiwyg from "./mui/wysiwyg/Wysiwyg";

const components = {
  Button,
  IconButton,
  Checkbox,
  DatePicker,
  DatePickerFromTo,
  Input,
  Link,
  Loading,
  Radio,
  Select,
  SelectMulti,
  AutoComplete,
  Snackbar,
  SnackbarAlert,
  CollapsibleVirtualDataGrid,
  VirtualizedTable,
  IconMenu,
  Switch,
  Upload,
  Download,
  Pagination,
  Tooltip,
  Popper,
  Wysiwyg,
};

export default components;

export {
  Button,
  IconButton,
  Checkbox,
  DatePicker,
  DatePickerFromTo,
  Input,
  Link,
  Loading,
  Radio,
  Select,
  SelectMulti,
  AutoComplete,
  Snackbar,
  SnackbarAlert,
  CollapsibleVirtualDataGrid,
  VirtualizedTable,
  IconMenu,
  Switch,
  Upload,
  Download,
  Tooltip,
  Popper,
  Wysiwyg,
};
