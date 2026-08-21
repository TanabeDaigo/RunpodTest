/**
 * @file generate_unit_test_formEx.js
 * @description unit_test_formEx配下のテストページを自動生成するスクリプト
 *
 * このスクリプトは、FormExフックファイルを参照して、
 * 各フックのテストページを自動生成します。
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @since 2024-12-19
 */

// Node.jsの標準モジュールをインポート
import fs from "fs"; // ファイルシステム操作
import path from "path"; // パス操作
import { fileURLToPath } from "url"; // ESモジュール用のファイルパス変換

// ESモジュール環境での__dirnameと__filenameの取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 対象のFormExフックファイルの設定
// 各フックの名前、ファイル名、タイトル、説明を定義
const FORMEX_FILES = [
  {
    name: "useInputEx", // フック名（ディレクトリ名として使用）
    file: "useInputEx.js", // ソースファイル名
    title: "useInputEx 関数一覧テスト", // ページタイトル
    description: "useInputExは、フォーム入力フィールドを簡単に生成するためのカスタムフックです。各関数は特定の用途に最適化された入力フィールドを提供します。",
  },
  {
    name: "useDatePickerEx",
    file: "useDatePickerEx.js",
    title: "useDatePickerEx 関数一覧テスト",
    description: "useDatePickerExは、フォーム日付ピッカーフィールドを簡単に生成するためのカスタムフックです。各関数は特定の用途に最適化された日付ピッカーフィールドを提供します。",
  },
  {
    name: "useCheckBoxEx",
    file: "useCheckBoxEx.js",
    title: "useCheckBoxEx 関数一覧テスト",
    description: "useCheckBoxExは、フォームチェックボックスフィールドを簡単に生成するためのカスタムフックです。各関数は特定の用途に最適化されたチェックボックスフィールドを提供します。",
  },
  {
    name: "useSwitchEx",
    file: "useSwitchEx.js",
    title: "useSwitchEx 関数一覧テスト",
    description: "useSwitchExは、フォームスイッチフィールドを簡単に生成するためのカスタムフックです。各関数は特定の用途に最適化されたスイッチフィールドを提供します。",
  },
  {
    name: "useRadioEx",
    file: "useRadioEx.js",
    title: "useRadioEx 関数一覧テスト",
    description: "useRadioExは、フォームラジオボタンフィールドを簡単に生成するためのカスタムフックです。各関数は特定の用途に最適化されたラジオボタンフィールドを提供します。",
  },
];

// 出力先のベースパス（webappのunit_test_formExディレクトリ）
const OUTPUT_BASE_PATH = path.join(__dirname, "../../../apps/webapp/src/app/unit_test_formEx");

/**
 * テンプレートファイルを読み込む
 * @param {string} templateName - テンプレートファイル名
 * @returns {string} テンプレートファイルの内容
 */
const loadTemplate = (templateName) => {
  try {
    // テンプレートファイルのパスを構築
    const templatePath = path.join(__dirname, "template", "generate_unit_test_formEx", templateName);
    // ファイルを読み込み、UTF-8でデコード
    return fs.readFileSync(templatePath, "utf8");
  } catch (error) {
    console.error(`❌ テンプレートファイル読み込みエラー: ${templateName}`, error.message);
    throw error;
  }
};

/**
 * FormExファイルから関数一覧とlabelを抽出
 * @param {string} filePath - FormExファイルのパス
 * @returns {Array} 関数一覧（関数名とlabelのペア）
 */
const extractFunctions = (filePath) => {
  try {
    // ファイル内容を読み込み
    const content = fs.readFileSync(filePath, "utf8");
    const functions = [];

    // 関数定義を抽出する正規表現
    // const functionName = (params) => { の形式をマッチ
    const functionRegex = /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{/g;
    let match;

    // すべての関数定義を検索
    while ((match = functionRegex.exec(content)) !== null) {
      const functionName = match[1];

      // 内部関数やヘルパー関数を除外するフィルタリング
      // アンダースコアで始まる関数、useを含む関数、logを含む関数、generateを含む関数を除外
      if (!functionName.startsWith("_") && !functionName.includes("use") && !functionName.includes("log") && !functionName.includes("generate")) {
        // 関数内のlabelプロパティを抽出する正規表現
        // 関数定義からlabel: "value"の部分を検索
        const labelRegex = new RegExp(`const\\s+${functionName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*{[\\s\\S]*?label:\\s*["']([^"']+)["']`, "g");
        const labelMatch = labelRegex.exec(content);
        // labelが見つからない場合は関数名をそのまま使用
        const label = labelMatch ? labelMatch[1] : functionName;

        // 関数情報を配列に追加
        functions.push({
          name: functionName,
          label: label,
        });
      }
    }

    return functions;
  } catch (error) {
    console.error(`❌ ファイル読み込みエラー: ${filePath}`, error.message);
    return [];
  }
};

/**
 * 関数を分類する
 * 関数名の特徴に基づいて、用途別にカテゴリ分けを行う
 * @param {Array} functions - 関数一覧（関数名とlabelのペア）
 * @param {string} hookName - フック名
 * @returns {Object} 分類された関数
 */
const categorizeFunctions = (functions, hookName) => {
  // カテゴリ別の配列を初期化
  const categories = {
    basic: [], // 基本関数（ID、タイトル、URL、テーブル関連など）
    status: [], // ステータス関数（削除フラグ、状態管理など）
    mail: [], // メール関連関数
    personal: [], // 個人情報関数（性別、生年月日、血液型など）
    other: [], // その他の関数
  };

  // 各関数をカテゴリに分類
  functions.forEach((funcObj) => {
    const func = funcObj.name;
    const funcLower = func.toLowerCase(); // 大文字小文字を区別しない比較のため

    // ステータス関連の関数を判定
    if (funcLower.includes("status") || funcLower.includes("deleted")) {
      categories.status.push(funcObj);
    }
    // メール関連の関数を判定
    else if (funcLower.includes("mail")) {
      categories.mail.push(funcObj);
    }
    // 個人情報関連の関数を判定
    else if (
      funcLower.includes("sex") || // 性別
      funcLower.includes("birth") || // 生年月日
      funcLower.includes("smoking") || // 喫煙
      funcLower.includes("blood") || // 血液型
      funcLower.includes("spouse") || // 配偶者
      funcLower.includes("auth") || // 認証
      funcLower.includes("province") // 都道府県
    ) {
      categories.personal.push(funcObj);
    }
    // 基本関数を判定
    else if (
      funcLower.includes("id") || // ID
      funcLower.includes("title") || // タイトル
      funcLower.includes("url") || // URL
      funcLower.includes("table") || // テーブル
      funcLower.includes("sort") || // ソート
      funcLower.includes("count") || // カウント
      funcLower.includes("created") || // 作成日時
      funcLower.includes("updated") || // 更新日時
      funcLower.includes("date") || // 日付
      funcLower.includes("datetime") || // 日時
      funcLower.includes("timestamp") || // タイムスタンプ
      funcLower.includes("tinyint") // 小さな整数
    ) {
      categories.basic.push(funcObj);
    }
    // その他の関数
    else {
      categories.other.push(funcObj);
    }
  });

  return categories;
};

/**
 * styles.jsファイルを生成
 * 共通のスタイルファイルをテンプレートから生成
 * @returns {string} styles.jsファイルの内容
 */
const generateStyles = () => {
  return loadTemplate("styles.js.template");
};

/**
 * レイアウトファイルを生成
 * Next.jsのレイアウトファイルを生成
 * @param {Object} hookInfo - フック情報
 * @returns {string} レイアウトファイルの内容
 */
const generateLayout = (hookInfo) => {
  const template = loadTemplate("layout.js.template");
  // テンプレート内のプレースホルダーを実際の値に置換
  return template.replace(/\{\{name\}\}/g, hookInfo.name).replace(/\{\{title\}\}/g, hookInfo.title);
};

/**
 * useUnitTestファイルを生成
 * テスト用のカスタムフックファイルを生成
 * @param {Object} hookInfo - フック情報
 * @returns {string} useUnitTestファイルの内容
 */
const generateUseUnitTest = (hookInfo) => {
  const template = loadTemplate("useUnitTest.js.template");
  // テンプレート内のプレースホルダーを実際の値に置換
  return template.replace(/\{\{name\}\}/g, hookInfo.name);
};

/**
 * ページファイルを生成
 * メインのテストページファイルを生成
 * @param {Object} hookInfo - フック情報
 * @param {Object} categories - 分類された関数
 * @returns {string} ページファイルの内容
 */
const generatePage = (hookInfo, categories) => {
  // すべての関数を一つの配列にまとめる
  const allFunctions = [...categories.basic, ...categories.status, ...categories.mail, ...categories.personal, ...categories.other];

  /**
   * 関数カードを生成する内部関数
   * @param {Array} functions - 関数の配列
   * @param {string} categoryTitle - カテゴリタイトル
   * @returns {string} 生成された関数カードのHTML
   */
  const generateFunctionCards = (functions, categoryTitle) => {
    // 関数がない場合は空文字を返す
    if (functions.length === 0) return "";

    // 各関数に対してカードを生成
    return functions
      .map((funcObj) => {
        const func = funcObj.name;
        // 関数名からプレフィックスを除去（input_, datePicker_など）
        const displayName = func.replace(/^(input_|datePicker_|checkbox_|switch_)/, "");
        // アンダースコアをスペースに変換し、各単語の最初の文字を大文字にする
        const title = displayName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

        // 関数カードのHTMLを生成
        return `          <TestDialogCard>
            <TestDialogTitle>${title}</TestDialogTitle>
            <TestDialogDescription>
              <h4>${func}</h4>
              {formProps.${func}()}
              <div style={{ marginTop: "1rem" }}>
                <CodeBlock>{generateCodeExample("${func}")}</CodeBlock>
              </div>
              <ButtonContainer>
                {formProps.button("none", {
                  children: "コードをコピー",
                  onClick: () => copyToClipboard(generateCodeExample("${func}")),
                })}
              </ButtonContainer>
            </TestDialogDescription>
          </TestDialogCard>`;
      })
      .join("\n\n"); // カード間に空行を挿入
  };

  // ページテンプレートを読み込み
  const template = loadTemplate("page.js.template");

  // テンプレート変数を実際の値に置換
  return (
    template
      .replace(/\{\{name\}\}/g, hookInfo.name)
      .replace(/\{\{title\}\}/g, hookInfo.title)
      .replace(/\{\{description\}\}/g, hookInfo.description)
      // すべての関数の一覧を生成（コメント付き）
      .replace(/\{\{allFunctions\}\}/g, allFunctions.map((funcObj) => `formProps.${funcObj.name}(); // ${funcObj.label}`).join("\n"))
      // 基本関数セクションを生成
      .replace(
        /\{\{basicFunctions\}\}/g,
        categories.basic.length > 0
          ? `
          <TestDialogCard>
            <TestDialogTitle>基本関数</TestDialogTitle>
            <TestDialogDescription>
              <p>基本的な入力フィールドを生成する関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
          ${generateFunctionCards(categories.basic, "基本関数")}`
          : ""
      )
      // ステータス関数セクションを生成
      .replace(
        /\{\{statusFunctions\}\}/g,
        categories.status.length > 0
          ? `
          <TestDialogCard>
            <TestDialogTitle>ステータス関数</TestDialogTitle>
            <TestDialogDescription>
              <p>ステータスや削除フラグなどの状態管理用の関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
          ${generateFunctionCards(categories.status, "ステータス関数")}`
          : ""
      )
      // メール関数セクションを生成
      .replace(
        /\{\{mailFunctions\}\}/g,
        categories.mail.length > 0
          ? `
          <TestDialogCard>
            <TestDialogTitle>メール関数</TestDialogTitle>
            <TestDialogDescription>
              <p>メールアドレス入力用の関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
          ${generateFunctionCards(categories.mail, "メール関数")}`
          : ""
      )
      // 個人情報関数セクションを生成
      .replace(
        /\{\{personalFunctions\}\}/g,
        categories.personal.length > 0
          ? `
          <TestDialogCard>
            <TestDialogTitle>個人情報関数</TestDialogTitle>
            <TestDialogDescription>
              <p>個人情報入力用の関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
          ${generateFunctionCards(categories.personal, "個人情報関数")}`
          : ""
      )
      // その他の関数セクションを生成
      .replace(
        /\{\{otherFunctions\}\}/g,
        categories.other.length > 0
          ? `
          <TestDialogCard>
            <TestDialogTitle>その他の関数</TestDialogTitle>
            <TestDialogDescription>
              <p>その他の特殊な用途の関数群です。</p>
            </TestDialogDescription>
          </TestDialogCard>
          ${generateFunctionCards(categories.other, "その他の関数")}`
          : ""
      )
  );
};

/**
 * ファイルを生成する
 * 指定されたパスにファイルを書き込む
 * @param {string} filePath - 出力ファイルパス
 * @param {string} content - ファイル内容
 */
const writeFile = (filePath, content) => {
  try {
    // ディレクトリが存在しない場合は再帰的に作成
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // ファイルに内容を書き込み
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ ファイル生成完了: ${filePath}`);
  } catch (error) {
    console.error(`❌ ファイル生成エラー: ${filePath}`, error.message);
  }
};

/**
 * メイン処理
 * スクリプトの実行エントリーポイント
 */
const main = () => {
  console.log("🚀 FormExテストページ生成を開始します...");

  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(OUTPUT_BASE_PATH)) {
    fs.mkdirSync(OUTPUT_BASE_PATH, { recursive: true });
  }

  // styles.jsファイルを生成（一度だけ、全フック共通）
  const stylesPath = path.join(OUTPUT_BASE_PATH, "styles.js");
  writeFile(stylesPath, generateStyles());

  // 各FormExファイルに対してテストページを生成
  FORMEX_FILES.forEach((hookInfo) => {
    console.log(`\n ${hookInfo.name} のテストページを生成中...`);

    // FormExファイルのパスを構築
    const formexPath = path.join(__dirname, "../src/client/hooks/FormEx", hookInfo.file);

    // 関数一覧を抽出
    const functions = extractFunctions(formexPath);
    console.log(`   抽出された関数数: ${functions.length}`);

    // 関数が見つからない場合はスキップ
    if (functions.length === 0) {
      console.log(`   ⚠️  ${hookInfo.name} から関数が見つかりませんでした`);
      return;
    }

    // 関数を用途別に分類
    const categories = categorizeFunctions(functions, hookInfo.name);
    console.log(`   分類結果:`, {
      basic: categories.basic.length, // 基本関数の数
      status: categories.status.length, // ステータス関数の数
      mail: categories.mail.length, // メール関数の数
      personal: categories.personal.length, // 個人情報関数の数
      other: categories.other.length, // その他の関数の数
    });

    // 各ファイルを生成するためのディレクトリパス
    const hookDir = path.join(OUTPUT_BASE_PATH, hookInfo.name);

    // レイアウトファイルを生成
    const layoutPath = path.join(hookDir, "layout.js");
    writeFile(layoutPath, generateLayout(hookInfo));

    // useUnitTestファイルを生成
    const useUnitTestPath = path.join(hookDir, "useUnitTest.js");
    writeFile(useUnitTestPath, generateUseUnitTest(hookInfo));

    // メインページファイルを生成
    const pagePath = path.join(hookDir, "page.js");
    writeFile(pagePath, generatePage(hookInfo, categories));

    console.log(`   ✅ ${hookInfo.name} のテストページ生成完了`);
  });

  console.log("\n🎉 すべてのテストページ生成が完了しました！");
};

// スクリプトが直接実行された場合のみメイン処理を実行
// コメントアウトされている条件分岐は、モジュールとして使用する場合の制御用
//if (import.meta.url === `file://${process.argv[1]}`) {
main();
//}

// モジュールとして使用する場合のエクスポート
export { main };
