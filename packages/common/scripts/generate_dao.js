/**
 * Daoファイル自動生成スクリプト
 * - db_schema.js のテーブル名から Dao クラスを作成
 * - 既存ファイルがある場合は確認してから上書き
 * - 生成後に dao/index.js を全再生成
 *
 * 実行例:
 *   node ./scripts/generate_dao.js
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 出力先ディレクトリ
const daoDir = path.resolve(__dirname, "../src/server/dao");
// スキーマファイルパス
const schemaFilePath = path.resolve(__dirname, "../src/server/db/schema/db_schema.js");

// スキーマを読み込む（ESMのため file:// に変換）
async function loadSchema() {
  const schemaModule = await import(pathToFileURL(schemaFilePath).href);
  // export const schema = { ... } を想定
  return schemaModule.schema || {};
}

// snake_case / ANY_CASE を PascalCase に変換
function toPascalCase(name) {
  return String(name)
    .split(/[^a-zA-Z0-9]+/g)
    .filter(Boolean)
    .map((token) => {
      const lower = token.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

// テーブル名から日本語のコメントを生成
function getTableComment(tableName) {
  const commentMap = {
    auto_make_items: "自動作成アイテム",
    auto_make_test: "自動作成テスト",
    categories: "カテゴリ",
    commons: "共通マスタ",
    component_explans: "コンポーネント説明",
    compornent_explans: "コンポーネント説明",
    dbms: "データベース管理システム",
    industries: "業界",
    prefectures: "都道府県",
    projects: "プロジェクト",
    settings: "設定",
    src_templates: "ソーステンプレート",
    status: "ステータス",
    unit_test: "単体テスト",
    users: "ユーザー",
  };
  return commentMap[tableName] || tableName;
}

// テーブルスキーマからプライマリキーを取得
function getPrimaryKey(tableSchema) {
  for (const [columnName, columnInfo] of Object.entries(tableSchema)) {
    if (columnInfo.is_primary_key) {
      return columnName;
    }
  }
  return "id"; // デフォルト
}

// SQLの予約語リスト
const SQL_RESERVED_WORDS = new Set([
  "select",
  "from",
  "where",
  "join",
  "inner",
  "left",
  "right",
  "outer",
  "on",
  "as",
  "and",
  "or",
  "not",
  "in",
  "exists",
  "between",
  "like",
  "is",
  "null",
  "order",
  "by",
  "group",
  "having",
  "limit",
  "offset",
  "union",
  "distinct",
  "all",
  "any",
  "some",
  "case",
  "when",
  "then",
  "else",
  "end",
  "if",
  "while",
  "for",
  "do",
  "break",
  "continue",
  "return",
  "function",
  "var",
  "let",
  "const",
  "true",
  "false",
  "to",
  "of",
  "with",
  "as",
  "at",
  "be",
  "by",
  "do",
  "go",
  "he",
  "if",
  "in",
  "is",
  "it",
  "me",
  "my",
  "no",
  "of",
  "on",
  "or",
  "so",
  "to",
  "up",
  "us",
  "we",
]);

// 安全なエイリアスを生成する関数
function generateSafeAlias(tableName) {
  // テーブル名の最初の2文字を取得
  let alias = tableName.substring(0, 2).toLowerCase();

  // 予約語の場合は数字を追加
  if (SQL_RESERVED_WORDS.has(alias)) {
    alias = alias + "1";
  }

  // さらに短い場合はテーブル名の最初の3文字を試す
  if (alias.length < 2) {
    alias = tableName.substring(0, 3).toLowerCase();
    if (SQL_RESERVED_WORDS.has(alias)) {
      alias = alias + "1";
    }
  }

  return alias;
}

// 外部キー関係を検出する関数
function findForeignKeyRelations(tableName, tableSchema, allSchemas) {
  const relations = [];

  for (const [columnName, columnInfo] of Object.entries(tableSchema)) {
    // 外部キーの可能性があるカラムを検出
    // 例: project_id, dbms_id, category_id など
    if (columnName.endsWith("_id") && !columnInfo.is_primary_key) {
      // 関連テーブル名を推測
      const relatedTableName = columnName.replace("_id", "");

      // 関連テーブルが存在し、プライマリキーが一致するかチェック
      if (allSchemas[relatedTableName]) {
        const relatedTableSchema = allSchemas[relatedTableName];
        const relatedPrimaryKey = getPrimaryKey(relatedTableSchema);

        // プライマリキーが一致する場合、関係を追加
        if (relatedPrimaryKey === columnName.replace("_id", "_id") || (relatedPrimaryKey === "id" && columnName === `${relatedTableName}_id`)) {
          relations.push({
            columnName,
            relatedTableName,
            relatedPrimaryKey,
            alias: generateSafeAlias(relatedTableName), // 安全なエイリアスを生成
          });
        }
      }
    }
  }

  return relations;
}

// データベースの種類に応じた日付フォーマット関数を取得
function getDateFormatFunction(dialect) {
  switch (dialect) {
    case "mysql":
      return (tableAlias, columnName) => `DATE_FORMAT(${tableAlias}.${columnName}, '%Y/%m/%d %H:%i')`;
    case "postgres":
      return (tableAlias, columnName) => `TO_CHAR(${tableAlias}.${columnName}, 'YYYY/MM/DD HH24:MI')`;
    default:
      // デフォルトはMySQL形式
      return (tableAlias, columnName) => `DATE_FORMAT(${tableAlias}.${columnName}, '%Y/%m/%d %H:%i')`;
  }
}

// Daoコンテンツを生成
function buildDaoContent(className, tableName, tableSchema, allSchemas) {
  const tableComment = getTableComment(tableName);
  const primaryKey = getPrimaryKey(tableSchema);

  // データベースの種類を取得（環境変数から）
  const dbDialect = process.env.DB_DIALECT || "mysql";
  const dateFormatFunction = getDateFormatFunction(dbDialect);

  // 外部キー関係を検出
  const relations = findForeignKeyRelations(tableName, tableSchema, allSchemas);

  // メインテーブルの安全なエイリアスを生成
  const mainTableAlias = generateSafeAlias(tableName);

  // カラム情報を取得
  const columns = [];
  const dateColumns = [];
  const joinColumns = []; // JOINで取得するカラム
  let hasIsDeleted = false;
  let hasStatus = false;

  for (const [columnName, columnInfo] of Object.entries(tableSchema)) {
    if (columnName === "is_deleted") {
      hasIsDeleted = true;
    }
    if (columnName === "status") {
      hasStatus = true;
    }

    if (columnInfo.type === "timestamp" || columnInfo.type === "datetime") {
      dateColumns.push({
        name: columnName,
        comment: columnInfo.comment || columnName,
      });
    } else {
      columns.push({
        name: columnName,
        comment: columnInfo.comment || columnName,
      });
    }
  }

  // JOINで取得するカラムを追加
  for (const relation of relations) {
    const relatedTableSchema = allSchemas[relation.relatedTableName];
    for (const [columnName, columnInfo] of Object.entries(relatedTableSchema)) {
      if (
        columnName !== relation.relatedPrimaryKey &&
        !columnName.includes("created_at") &&
        !columnName.includes("updated_at") &&
        !columnName.includes("regist_user") &&
        !columnName.includes("update_user") &&
        !columnName.includes("dbcount")
      ) {
        joinColumns.push({
          name: columnName,
          alias: `${relation.alias}_${columnName}`,
          comment: columnInfo.comment || columnName,
        });
      }
    }
  }

  // FROM句とJOIN句を生成
  const fromClause = `"${tableName} ${mainTableAlias}"`;
  const joinClauses = relations
    .map(
      (relation) =>
        `"LEFT JOIN ${relation.relatedTableName} ${relation.alias} ON ${mainTableAlias}.${relation.columnName} = ${relation.alias}.${relation.relatedPrimaryKey} AND ${relation.alias}.is_deleted = false"`
    )
    .join(", ");

  const fromAndJoins = joinClauses ? `_sqljs.from([${fromClause}, ${joinClauses}]);` : `_sqljs.from([${fromClause}]);`;

  return `import { injectable } from "tsyringe";
import AbstractDao from "../AbstractDao";
import { logjs, sqljs, dayjs } from "@lib/server";

const log = new logjs("${className}");

/**
 * ${tableComment}情報を管理するDAOクラス
 * ${tableComment}の検索、取得などのデータベース操作を担当
 */
@injectable()
class ${className} extends AbstractDao {
  constructor() {
    super("${tableName}");
  }

  /**
   * ${tableComment}情報を検索・取得する
   * @param {Object} params - 検索パラメータ
   * @param {number} [params.page=1] - ページ番号
   * @param {number} [params.pageSize=100] - 1ページあたりの件数
   * @param {string} [params.sortKey="${primaryKey}"] - ソートキー
   * @param {string} [params.sortOrder="desc"] - ソート順序
   * @returns {Object} 検索結果（rows, total, page, pageSize）
   */
  async find(params) {
    log.debug("find params", params);

    // パラメータのデフォルト値を設定
    const {
      page = 1,
      pageSize = 100,
      sortKey = "${primaryKey}", // 指定していなければプライマリキーの先頭
      sortOrder = "desc", // 指定していなければ降順
    } = params;

    try {
      // ページネーション用のオフセット計算
      const offset = (page - 1) * pageSize;

      // SQLクエリビルダーの初期化
      const _sqljs = new sqljs();

      // 取得するカラムの指定
      _sqljs.select([
${columns.map((col) => `        "${mainTableAlias}.${col.name} as ${col.name}",`).join("\n")}
${joinColumns.map((col) => `        "${col.alias.split("_")[0]}.${col.name} as ${col.alias}", // ${col.comment}`).join("\n")}
${dateColumns.map((col) => `        "${dateFormatFunction(mainTableAlias, col.name)} as ${col.name}", // ${col.comment}をフォーマット`).join("\n")}
      ]);

      // テーブル結合の設定
      ${fromAndJoins}

      // 基本条件：有効なレコードのみ
${hasIsDeleted ? `      _sqljs.where("${mainTableAlias}.is_deleted = false");` : hasStatus ? `      _sqljs.where("${mainTableAlias}.status != 1");` : "      // 削除条件なし"}

      // オプション条件の追加
      log.debug("auto_where", params);
      _sqljs.autoWhere("${mainTableAlias}", params);

      // ソートとページネーションの設定
      _sqljs.lastSql(\`order by \${sortKey} \${sortOrder} LIMIT \${pageSize} OFFSET \${offset}\`);

      // SQLクエリの実行
      const _sqlInfo = await _sqljs.toFindSql();
      log.debug("find sqlInfo", _sqlInfo);
      const results = await this.dbjs.find(_sqlInfo.sql, _sqlInfo.params);
      const [count, data] = results;

      // 結果の整形と返却
      return {
        rows: data, // 取得したデータ
        total: count, // 総件数
        page, // 現在のページ番号
        pageSize, // 1ページあたりの件数
      };
    } catch (e) {
      // エラーが発生した場合は空の結果を返却
      log.error(e);
      throw e;
    }
  }
}

export default ${className};
`;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

// dao/index.js を全再生成
async function updateDaoIndex() {
  const entries = await fs.readdir(daoDir, { withFileTypes: true });
  const daoFiles = entries
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => name.endsWith("Dao.js") && name !== "AbstractDao.js");

  const baseNames = daoFiles.map((name) => name.replace(/\.js$/, "")).sort((a, b) => a.localeCompare(b));

  const lines = baseNames.map((bn) => `export { default as ${bn} } from "./${bn}.js";`);
  const indexPath = path.join(daoDir, "index.js");
  await fs.writeFile(indexPath, lines.join("\n") + "\n", "utf8");
  console.log(`dao/index.js を更新しました: エクスポート ${baseNames.length} 件`);
}

// ユーザーに確認を求める関数
function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

// コマンドライン引数を解析
function parseArgs() {
  const args = process.argv.slice(2);
  const force = args.includes("--force") || args.includes("-f");
  const skip = args.includes("--skip") || args.includes("-s");
  return { force, skip };
}

async function generateDaos() {
  const { force, skip } = parseArgs();
  const schema = await loadSchema();
  const tableNames = Object.keys(schema || {});
  if (tableNames.length === 0) {
    console.log("スキーマにテーブルが見つかりません。処理を終了します。");
    return;
  }

  await ensureDir(daoDir);

  let created = 0;
  let skipped = 0;
  let overwritten = 0;
  let existingFiles = [];

  // 既存ファイルをチェック
  for (const tableName of tableNames) {
    const className = `${toPascalCase(tableName)}Dao`;
    const fileName = `${className}.js`;
    const filePath = path.join(daoDir, fileName);

    if (await fileExists(filePath)) {
      existingFiles.push(fileName);
    }
  }

  // 既存ファイルがある場合の処理
  if (existingFiles.length > 0 && !skip) {
    if (force) {
      console.log(`既存ファイル ${existingFiles.length} 件を強制的に上書きします。`);
    } else {
      console.log(`既存ファイルが見つかりました: ${existingFiles.join(", ")}`);
      const answer = await askQuestion("既存ファイルを上書きしますか？ (y/N): ");

      if (answer !== "y" && answer !== "yes") {
        console.log("処理をキャンセルしました。");
        return;
      }
    }
  }

  // DAOファイルを生成
  for (const tableName of tableNames) {
    const className = `${toPascalCase(tableName)}Dao`;
    const fileName = `${className}.js`;
    const filePath = path.join(daoDir, fileName);

    if (await fileExists(filePath)) {
      if (force || !skip) {
        const content = buildDaoContent(className, tableName, schema[tableName], schema);
        await fs.writeFile(filePath, content, "utf8");
        overwritten++;
        console.log(`上書き: ${fileName}`);
      } else {
        skipped++;
      }
      continue;
    }

    const content = buildDaoContent(className, tableName, schema[tableName], schema);
    await fs.writeFile(filePath, content, "utf8");
    created++;
  }

  // 結果の表示
  if (overwritten > 0) {
    console.log(`Dao生成完了: 新規作成 ${created} 件, 上書き ${overwritten} 件, スキップ ${skipped} 件`);
  } else {
    console.log(`Dao生成完了: 新規作成 ${created} 件, スキップ ${skipped} 件`);
  }

  // 生成後に index.js を更新
  await updateDaoIndex();
}

// 直接実行時
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateDaos().catch((err) => {
    console.error("Dao生成でエラーが発生しました:", err);
    process.exit(1);
  });
}

export default generateDaos;
