/**
 * @file default_params.js
 * @description Material-UIコンポーネントのデフォルトパラメータ設定
 *
 * このモジュールは、Material-UIコンポーネントの
 * デフォルトパラメータを一元管理するための設定ファイルです。
 *
 * 主な機能：
 * - 共通パラメータの定義
 * - 各コンポーネント固有のデフォルト値の設定
 * - スタイル、サイズ、状態などの一貫した管理
 * - プロジェクト全体でのUIの統一性の確保
 *
 * @example
 * // コンポーネントでの使用例
 * import { default_params } from './mui/default_params';
 *
 * // 入力フィールドのデフォルトパラメータを取得
 * const inputParams = default_params.input;
 *
 * // カスタマイズしたパラメータの作成
 * const customParams = {
 *   ...default_params.input,
 *   label: 'ユーザー名',
 *   required: true
 * };
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

/**
 * Material-UIコンポーネントのデフォルトパラメータ
 * @type {Object}
 */
export const default_params = {
  /**
   * 共通のデフォルトパラメータ
   * すべてのコンポーネントで共有される基本設定
   *
   * @type {Object}
   * @property {string} variant - フィールドのスタイル（standard/outlined/filled）
   * @property {string} color - カラーテーマ（primary/secondary/error/info/success/warning）
   * @property {boolean} disabled - 無効化状態
   * @property {string} size - サイズ（small/medium）
   * @property {string} margin - マージン（none/dense/normal）
   */
  common: {
    variant: "outlined",
    color: "primary",
    disabled: false,
    size: "medium",
    margin: "dense",
  },

  /**
   * 入力フィールドのデフォルトパラメータ
   * テキスト入力、パスワード入力、数値入力などの基本設定
   *
   * @type {Object}
   * @property {string} label - ラベルテキスト
   * @property {string} placeholder - プレースホルダーテキスト
   * @property {string} type - 入力タイプ（text/password/number等）
   * @property {string} variant - フィールドのスタイル
   * @property {string} helperText - ヘルパーテキスト
   * @property {boolean} error - エラー状態
   * @property {boolean} disabled - 無効化状態
   * @property {string} autoComplete - オートコンプリート
   * @property {boolean} multiline - 複数行入力
   * @property {string} size - サイズ
   * @property {boolean} clear - クリアボタンの表示
   * @property {boolean} fullWidth - 幅100%
   * @property {boolean} fullwidth - 幅100%（互換性のため）
   */
  input: {
    label: "",
    placeholder: "",
    // type: "text",
    variant: "outlined",
    helperText: "",
    error: false,
    disabled: false,
    autoComplete: "off",
    multiline: false,
    size: "small",
    clear: true,
    fullWidth: undefined,
    fullwidth: undefined,
    name:"",
    className:"",
    inputMode:"node",
  },

  /**
   * WYSIWYG（Tiptap）エディタのデフォルトパラメータ
   * `mode` はマージ後の params で上書き可能。`enabledExtensions` は `mode === 'custom'` のときのみ有効。
   *
   * @type {Object}
   * @property {'std'|'pro'|'custom'} mode - std: StarterKit のみ / pro: 全拡張 / custom: 選択拡張
   * @property {string[]} enabledExtensions - custom 時の拡張キー（link, underline, textAlign 等）
   * @property {string} placeholder - プレースホルダー（placeholder 拡張が有効な場合）
   * @property {string} label - ラベル
   * @property {string} helperText - ヘルパーテキスト
   * @property {boolean} error - エラー表示
   * @property {boolean} disabled - 無効化
   * @property {boolean} fullWidth - 幅100%
   * @property {boolean} is_debug - logjs デバッグ
   * @property {number} minHeight - 編集領域の最小高さ（px 想定）
   * @property {boolean} showToolbar - ツールバー表示
   */
  wysiwyg: {
    mode: "std",
    enabledExtensions: [
      "link",
      "underline",
      "textAlign",
      "highlight",
      "placeholder",
      "image",
      "table",
      "taskList",
      "textStyle",
      "color",
    ],
    placeholder: "",
    label: "",
    helperText: "",
    error: false,
    disabled: false,
    fullWidth: true,
    is_debug: false,
    minHeight: 200,
    showToolbar: true,
  },

  /**
   * チェックボックスのデフォルトパラメータ
   * チェックボックスコンポーネントの基本設定
   *
   * @type {Object}
   * @property {string} color - カラーテーマ
   * @property {string} size - サイズ
   * @property {boolean} disabled - 無効化状態
   * @property {boolean} error - エラー状態
   * @property {string} labelPlacement - ラベルの位置（start/end/top/bottom）
   */
  checkbox: {
    color: "primary",
    size: "medium",
    disabled: false,
    error: false,
    labelPlacement: "end",
  },

  /**
   * リンクのデフォルトパラメータ
   * リンクコンポーネントの基本設定
   *
   * @type {Object}
   * @property {string} underline - アンダーラインの表示タイミング（none/hover/always）
   * @property {string} color - カラーテーマ
   * @property {boolean} disabled - 無効化状態
   */
  link: {
    underline: "hover",
    color: "primary",
    disabled: false,
  },

  /**
   * ラジオボタンのデフォルトパラメータ
   * ラジオボタングループの基本設定
   *
   * @type {Object}
   * @property {string} color - カラーテーマ
   * @property {string} size - サイズ
   * @property {boolean} disabled - 無効化状態
   * @property {boolean} error - エラー状態
   * @property {boolean} dense - コンパクト表示
   * @property {boolean} row - 行表示
   */
  radio: {
    color: "primary",
    size: "small",
    disabled: false,
    error: false,
    dense: true,
    row: true,
  },

  /**
   * セレクトボックスのデフォルトパラメータ
   * 単一選択のセレクトボックスの基本設定
   *
   * @type {Object}
   * @property {string} variant - フィールドのスタイル
   * @property {boolean} fullwidth - 幅100%
   * @property {string} size - サイズ
   * @property {boolean} disabled - 無効化状態
   * @property {boolean} error - エラー状態
   * @property {string} helperText - ヘルパーテキスト
   * @property {boolean} dense - コンパクト表示
   */
  select: {
    variant: "standard",
    fullwidth: false,
    size: "small",
    disabled: false,
    error: false,
    helperText: "",
    dense: true,
  },

  /**
   * 複数選択セレクトボックスのデフォルトパラメータ
   * 複数選択可能なセレクトボックスの基本設定
   *
   * @type {Object}
   * @property {string} variant - フィールドのスタイル
   * @property {boolean} fullwidth - 幅100%
   * @property {string} size - サイズ
   * @property {boolean} disabled - 無効化状態
   * @property {boolean} error - エラー状態
   * @property {boolean} multiple - 複数選択モード
   * @property {boolean} selectAll - 全選択オプションの表示
   * @property {Function} renderValue - 選択値の表示形式
   */
  selectMulti: {
    variant: "standard",
    fullwidth: false,
    size: "small",
    disabled: false,
    error: false,
    multiple: true,
    selectAll: true,
    renderValue: (selected) => selected.join(", "),
  },

  /**
   * ボタンのデフォルトパラメータ
   * ボタンコンポーネントの基本設定
   *
   * @type {Object}
   * @property {boolean} fullwidth - 幅100%
   */
  button: {
    fullwidth: true,
  },

  /**
   * アイコンボタンのデフォルトパラメータ
   * アイコンボタンコンポーネントの基本設定
   *
   * @type {Object}
   * @property {string} size - サイズ
   * @property {string} color - カラーテーマ
   * @property {boolean} disabled - 無効化状態
   */
  iconButton: {
    size: "medium",
    color: "secondary",
    disabled: false,
  },

  /**
   * 日付選択のデフォルトパラメータ
   * 日付選択コンポーネントの基本設定
   *
   * @type {Object}
   * @property {string} variant - フィールドのスタイル
   * @property {string} size - サイズ
   * @property {string} format - 日付フォーマット
   * @property {Array} views - 表示するビュー
   * @property {string} outputFormat - 出力形式
   * @property {boolean} disableFuture - 未来の日付を無効化
   * @property {boolean} disablePast - 過去の日付を無効化
   * @property {string} color - カラーテーマ
   * @property {boolean} disabled - 無効化状態
   * @property {boolean} readOnly - 読み取り専用
   * @property {string} helperText - ヘルパーテキスト
   * @property {boolean} fullwidth - 幅100%
   * @property {boolean} dense - コンパクト表示
   */
  datePicker: {
    variant: "standard",
    size: "small",
    format: "yyyy/MM/dd",
    views: ["year", "month", "day"],
    outputFormat: "YYYY/MM/DD",
    disableFuture: false,
    disablePast: false,
    color: "primary",
    disabled: false,
    readOnly: false,
    helperText: "",
    fullwidth: undefined,
    dense: true,
    autoComplete: "off",
  },

  /**
   * 日付選択のデフォルトパラメータ
   * 日付選択コンポーネントの基本設定
   *
   * @type {Object}
   * @property {string} variant - フィールドのスタイル
   * @property {string} size - サイズ
   * @property {string} format - 日付フォーマット
   * @property {Array} views - 表示するビュー
   * @property {string} outputFormat - 出力形式
   * @property {boolean} disableFuture - 未来の日付を無効化
   * @property {boolean} disablePast - 過去の日付を無効化
   * @property {string} color - カラーテーマ
   * @property {boolean} disabled - 無効化状態
   * @property {boolean} readOnly - 読み取り専用
   * @property {string} helperText - ヘルパーテキスト
   * @property {boolean} fullwidth - 幅100%
   * @property {boolean} dense - コンパクト表示
   */
  datePickerFrom: {
    variant: "standard",
    size: "small",
    format: "yyyy/MM/dd",
    views: ["year", "month", "day"],
    outputFormat: "YYYY/MM/DD",
    disableFuture: false,
    disablePast: false,
    color: "primary",
    disabled: false,
    readOnly: false,
    helperText: "",
    fullwidth: undefined,
    dense: true,
  },
  datePickerTo: {
    variant: "standard",
    size: "small",
    format: "yyyy/MM/dd",
    views: ["year", "month", "day"],
    outputFormat: "YYYY/MM/DD",
    disableFuture: false,
    disablePast: false,
    color: "primary",
    disabled: false,
    readOnly: false,
    helperText: "",
    fullwidth: undefined,
    dense: true,
  },
  datePickerOther: {
    disabled: false,
    isAnchorEl: false,
    showSwitch: false,
    switchSize: "small",
    switchLabel: "",
    switchBoxStyle: {},
    switchChecked: true,
    unspcified: {
      show: false,
      default: true,
    },
  },

  /**
   * オートコンプリートのデフォルトパラメータ
   * オートコンプリートコンポーネントの基本設定
   *
   * @type {Object}
   * @property {string} variant - フィールドのスタイル
   * @property {boolean} fullWidth - 幅100%
   * @property {string} size - サイズ
   * @property {boolean} disabled - 無効化状態
   * @property {boolean} dense - コンパクト表示
   * @property {boolean} error - エラー状態
   */
  autoComplete: {
    variant: "standard",
    fullWidth: true,
    size: "small",
    disabled: false,
    dense: true,
    error: false,
  },

  /**
   * オートコンプリートのデフォルトパラメータ
   * オートコンプリートコンポーネントの基本設定
   *
   * @type {Object}
   * @property {string} variant - フィールドのスタイル
   * @property {boolean} fullWidth - 幅100%
   * @property {string} size - サイズ
   * @property {boolean} disabled - 無効化状態
   * @property {boolean} dense - コンパクト表示
   * @property {boolean} error - エラー状態
   */

  collapsibleVirtualDataGrid: {
    rowHeight: 40, // 1行あたりの高さ
    maxHeight: 300, // 表の最大高さ
    tableWidth: 60, // 表の横幅
    tableHeight: "100vh", // 全体の高さ
    disableColumnMenu: true, // カラムメニューの有効/無効
    hideFooter: true, // フッターの有効/無効
    disableColumnResize: true, // カラムのサイズ変更の有効/無効
    toggleOpen: true, // 初期開閉の有効/無効
    density: "compact", // グリッドのグリッドの行の高さ
    iconSize: "small", // アイコンのサイズ
    parentHeaderStyle: { color: "primary.main" }, // 親ヘッダーセルのカスタムスタイル
    parentRowStyle: { color: "primary.main" }, // 親データ行のカスタムスタイル
    childHeaderStyle: {}, // 子グリッドのヘッダーセルに適用するスタイル
    childRowStyle: {}, // 子グリッドの行全体に適用するスタイル
  },

  virtualizedTable: {
    columns: [],
    rowHeightRatio: 0.1, // 1行表示する割合
    tableHeight: 500, // テーブルの高さ
    selectRowIndex: "", // 高さを変更する行
    selectRowHeight: "", // 変更する指定行の高さ
    headerHeight: 40, // ヘッダーの高さ
    lines: 2, // 表示する行数
    onHeaderClick: null,
    sortInfo: { dataKey: "", desc: false },
  },

  iconMenu: {
    show: true,
    color: "inherit",
    fontSize: "medium",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
  },

  switch: {
    disableRipple: false,
    labelPlacement: "end",
  },

  /**
   * 画像のデフォルトパラメータ
   * Next.jsのImageコンポーネントの基本設定
   *
   * @type {Object}
   * @property {string} alt - 代替テキスト
   * @property {number} width - 画像の幅
   * @property {number} height - 画像の高さ
   * @property {string} fill - 親要素を埋める（true/false）
   * @property {string} priority - 優先読み込み（true/false）
   * @property {string} quality - 画像品質（1-100）
   * @property {string} placeholder - プレースホルダー（blur/empty）
   * @property {string} blurDataURL - ブラー画像のデータURL
   * @property {string} sizes - レスポンシブ画像のサイズ
   * @property {string} loader - カスタムローダー関数
   * @property {boolean} unoptimized - 最適化を無効化
   * @property {string} style - カスタムスタイル
   * @property {string} className - CSSクラス名
   * @property {Function} onLoad - 読み込み完了時のコールバック
   * @property {Function} onError - エラー時のコールバック
   * @property {Function} onClick - クリック時のコールバック
   */
  image: {
    alt: "",
    width: undefined,
    height: undefined,
    fill: false,
    priority: false,
    quality: 75,
    placeholder: "empty",
    blurDataURL: undefined,
    sizes: undefined,
    loader: undefined,
    unoptimized: false,
    style: {},
    className: "",
    onLoad: undefined,
    onError: undefined,
    onClick: undefined,
  },

  upload: {
    multiple:true,
    maxLength:5,
    maxFileSize:5 * 1024 * 1024,
    isCsv:false,
  },

  download: {
    label:"CSVダウンロード",
  },
};
